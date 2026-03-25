// 全局变量
let userInfo = {
    hasVerified: false,
    roomNumber: '',
    orderNumber: '',
    phoneNumber: ''
};

// 预设数据
const presetData = {
    address: '北京市朝阳区建国路88号SOHO现代城5号楼2001室',
    doorLockPassword: '888888',
    wifiName: 'HomeSweetHome',
    wifiPassword: 'Welcome2024',
    parkingInfo: '小区地下停车场B2层，首小时10元，之后每小时5元，住客可享8折优惠',
    emergencyContact: '138-0013-8000',
   周边推荐: [
        '【眉州东坡酒楼】｜步行10分钟｜川菜｜人均80元｜010-88888888',
        '【星巴克咖啡】｜步行5分钟｜咖啡｜人均35元｜010-88889999',
        '【朝阳公园】｜步行15分钟｜景点｜免费｜010-88887777',
        '【便利蜂】｜步行3分钟｜超市｜24小时营业｜010-88886666'
    ]
};

// 关键词识别
const emergencyKeywords = ['门锁', '漏水', '停电', '受伤', '丢失', '投诉', '情绪激动'];

// 初始化
function init() {
    const sendButton = document.getElementById('sendButton');
    const userInput = document.getElementById('userInput');
    const quickQuestions = document.getElementById('quickQuestions');
    
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 为标准问题添加点击事件
    if (quickQuestions) {
        const quickQuestionElements = quickQuestions.querySelectorAll('.quick-question');
        quickQuestionElements.forEach(element => {
            element.addEventListener('click', function() {
                const question = this.getAttribute('data-question');
                userInput.value = question;
                sendMessage();
            });
        });
    }
}

// 发送消息
function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (message) {
        // 添加用户消息
        addMessage('user', message);
        userInput.value = '';
        
        // 处理消息
        setTimeout(() => {
            processMessage(message);
        }, 500);
    }
}

// 处理消息
function processMessage(message) {
    // 检查是否需要转人工
    if (checkEmergency(message)) {
        handleEmergency();
        return;
    }
    
    // 检查是否已验证身份
    if (!userInfo.hasVerified) {
        verifyUser(message);
    } else {
        // 处理已验证用户的问题
        handleUserQuestion(message);
    }
}

// 检查紧急情况
function checkEmergency(message) {
    return emergencyKeywords.some(keyword => message.includes(keyword));
}

// 处理紧急情况
function handleEmergency() {
    const response = `非常抱歉给您带来不便！😟
已**立即转接人工客服**并通知值班经理，请保持手机畅通。
应急处理：请尝试重启设备或等待工作人员上门
紧急电话：${presetData.emergencyContact}`;
    addMessage('bot', response);
    setTimeout(() => {
        addMessage('bot', '已为您转接人工，很快会有人联系您～');
    }, 1000);
}

// 验证用户身份
function verifyUser(message) {
    // 简单验证逻辑，实际项目中可能需要更复杂的验证
    if (message.match(/\d{3,}/)) {
        userInfo.hasVerified = true;
        userInfo.roomNumber = '1001'; // 模拟房号
        addMessage('bot', '身份验证成功！请问有什么可以帮助您的吗？');
    } else {
        addMessage('bot', '请提供您的房号或订单信息（手机尾号/订单号），以便我更好地为您服务');
    }
}

// 处理用户问题
function handleUserQuestion(message) {
    message = message.toLowerCase();
    
    if (message.includes('入住') || message.includes('地址') || message.includes('密码')) {
        handleCheckInGuide();
    } else if (message.includes('wifi') || message.includes('网络') || message.includes('空调') || message.includes('设施')) {
        handleFacilityUse();
    } else if (message.includes('保洁') || message.includes('加物') || message.includes('维修')) {
        handleServiceRequest(message);
    } else if (message.includes('周边') || message.includes('推荐') || message.includes('餐厅') || message.includes('景点')) {
        handleSurroundingRecommendations();
    } else if (message.includes('退房') || message.includes('发票') || message.includes('行李')) {
        handleCheckOutService();
    } else if (message.includes('谢谢') || message.includes('再见')) {
        handleFarewell();
    } else {
        // 无法识别的问题
        addMessage('bot', '我还没完全理解您的意思，已为您转接人工管家，请稍候～');
        setTimeout(() => {
            addMessage('bot', '已为您转接人工，很快会有人联系您～');
        }, 1000);
    }
}

// 处理入住指引
function handleCheckInGuide() {
    const response = `亲，欢迎入住～🏠
📍**地址**：${presetData.address}
🔑**门锁密码**：${presetData.doorLockPassword}（有效时间：入住日15:00–退房日12:00）
🚗**停车**：${presetData.parkingInfo}
紧急联系：${presetData.emergencyContact}
还有其他需要帮助的吗？`;
    addMessage('bot', response);
}

// 处理设施使用
function handleFacilityUse() {
    const response = `📶**Wi‑Fi**：名称【${presetData.wifiName}】密码【${presetData.wifiPassword}】
❄️**空调**：遥控器位置【床头柜】，模式切换，建议温度26℃
已经可以正常使用了吗？`;
    addMessage('bot', response);
}

// 处理服务请求
function handleServiceRequest(message) {
    let requestType = '';
    if (message.includes('保洁')) requestType = '保洁服务';
    else if (message.includes('加物')) requestType = '物品添加';
    else if (message.includes('维修')) requestType = '维修服务';
    
    const response = `好的，已收到您的需求～
房号：${userInfo.roomNumber}
需求：${requestType}
工作人员预计**15–30分钟**内送达/上门，请稍候～`;
    addMessage('bot', response);
    setTimeout(() => {
        addMessage('bot', '还有其他需要我帮忙的吗？');
    }, 1000);
}

// 处理周边推荐
function handleSurroundingRecommendations() {
    let response = '亲，为您推荐：\n';
    presetData.周边推荐.forEach((item, index) => {
        response += `${index + 1}. ${item}\n`;
    });
    response += '需要路线/更多偏好推荐可告诉我～';
    addMessage('bot', response);
    setTimeout(() => {
        addMessage('bot', '还有其他需要我帮忙的吗？');
    }, 1000);
}

// 处理退房服务
function handleCheckOutService() {
    const response = `⏰**退房时间**：12:00前
📝**流程**：关好门窗电器，关门自动落锁即可
🧳**行李寄存**：可寄存
感谢入住，期待下次见面～`;
    addMessage('bot', response);
    setTimeout(() => {
        addMessage('bot', '还有其他需要我帮忙的吗？');
    }, 1000);
}

// 处理告别
function handleFarewell() {
    addMessage('bot', '感谢入住，祝您旅途愉快，欢迎再来～');
}

// 添加消息到聊天界面
function addMessage(type, content) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type === 'user' ? 'user-message' : 'bot-message'}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // 处理换行和格式
    const paragraphs = content.split('\n');
    paragraphs.forEach(paragraph => {
        const p = document.createElement('p');
        // 处理加粗格式
        p.innerHTML = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        messageContent.appendChild(p);
    });
    
    messageDiv.appendChild(messageContent);
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 初始化
init();