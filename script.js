document.addEventListener('DOMContentLoaded', () => {
    const diceContainer = document.getElementById('dice-container');
    const historyContainer = document.getElementById('history-container');
    const rollBtn = document.getElementById('roll-btn');
    const rerollBtn = document.getElementById('reroll-btn');
    const diceCountInput = document.getElementById('dice-count');

    let diceValues = [];
    let selectedDice = [];

    rollBtn.addEventListener('click', () => {
        const diceCount = parseInt(diceCountInput.value);
        diceValues = rollDice(diceCount);
        selectedDice = [];
        renderDice(diceValues);
        rerollBtn.disabled = true; // 初始投掷后禁用重新投掷按钮
        addToHistory(diceValues, '初始投掷');
    });

    rerollBtn.addEventListener('click', () => {
        const diceToReroll = selectedDice.map(index => index);
        diceToReroll.forEach(index => {
            diceValues[index] = Math.floor(Math.random() * 6) + 1;
        });
        selectedDice = [];
        renderDice(diceValues);
        rerollBtn.disabled = true; // 重新投掷后禁用重新投掷按钮
        addToHistory(diceValues, '重新投掷');
    });

    function rollDice(count) {
        const dice = [];
        for (let i = 0; i < count; i++) {
            dice.push(Math.floor(Math.random() * 6) + 1);
        }
        return dice.sort((a, b) => a - b); // 排序骰子结果
    }

    function renderDice(values) {
        diceContainer.innerHTML = '';
        values.sort((a, b) => a - b).forEach((value, index) => { // 排序后渲染
            const diceElement = document.createElement('div');
            diceElement.classList.add('dice');
            diceElement.textContent = value;
            diceElement.addEventListener('click', () => {
                toggleSelectDice(index);
            });
            diceContainer.appendChild(diceElement);
            setTimeout(() => {
                diceElement.classList.add('rolling');
            }, 10);
            setTimeout(() => {
                diceElement.classList.remove('rolling');
            }, 510);
        });
    }

    function toggleSelectDice(index) {
        if (selectedDice.includes(index)) {
            selectedDice = selectedDice.filter(i => i !== index);
            diceContainer.children[index].classList.remove('selected');
        } else {
            selectedDice.push(index);
            diceContainer.children[index].classList.add('selected');
        }
        // 根据是否有选中的骰子，启用或禁用重新投掷按钮
        rerollBtn.disabled = selectedDice.length === 0;
    }

    function addToHistory(values, action) {
        const sortedValues = [...values].sort((a, b) => a - b); // 排序骰子结果
        const historyItem = document.createElement('div');
        historyItem.classList.add('history-item');

        // 创建历史记录文本
        const historyText = document.createElement('span');
        historyText.textContent = `${action}:`;
        historyItem.appendChild(historyText);

        // 创建历史记录骰子容器
        const historyDiceContainer = document.createElement('div');
        historyDiceContainer.classList.add('history-dice-container');

        // 渲染历史记录中的骰子
        sortedValues.forEach(value => {
            const diceElement = document.createElement('div');
            diceElement.classList.add('history-dice');
            diceElement.textContent = value;
            historyDiceContainer.appendChild(diceElement);
        });

        historyItem.appendChild(historyDiceContainer);

        // 创建操作按钮容器
        const actionsContainer = document.createElement('div');
        actionsContainer.classList.add('history-actions');

        // 创建刷新按钮
        const refreshBtn = document.createElement('button');
        refreshBtn.classList.add('refresh-btn');
        refreshBtn.textContent = '刷新';
        refreshBtn.addEventListener('click', () => {
            diceValues = [...sortedValues]; // 将最新结果更新为历史记录的值
            renderDice(diceValues); // 重新渲染骰子
            rerollBtn.disabled = true; // 刷新后禁用重新投掷按钮
        });
        actionsContainer.appendChild(refreshBtn);

        // 创建删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = '删除';
        deleteBtn.addEventListener('click', () => {
            historyContainer.removeChild(historyItem); // 删除该条记录
        });
        actionsContainer.appendChild(deleteBtn);

        // 将操作按钮添加到历史记录项
        historyItem.appendChild(actionsContainer);

        // 将新的历史记录插入到容器的顶部
        historyContainer.insertBefore(historyItem, historyContainer.firstChild);
    }
});