/**
 * BYD汽车销量数据管理界面JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // 模拟数据
    const salesData = [
        { id: 1, quarter: 'Q1', region: '华南', models: [{ name: '秦', sales: 34500, yoy: 12.5 }, { name: '汉', sales: 41200, yoy: 18.3 }] },
        { id: 2, quarter: 'Q1', region: '华东', models: [{ name: '唐', sales: 18900, yoy: 5.2 }, { name: '海豚', sales: 15700, yoy: -2.8 }] },
        { id: 3, quarter: 'Q1', region: '华北', models: [{ name: '元', sales: 12800, yoy: 7.5 }, { name: '宋', sales: 22400, yoy: 9.1 }] },
        { id: 4, quarter: 'Q2', region: '华南', models: [{ name: '秦', sales: 36200, yoy: 14.8 }, { name: '汉', sales: 43500, yoy: 20.1 }] },
        { id: 5, quarter: 'Q2', region: '华东', models: [{ name: '唐', sales: 19500, yoy: 6.7 }, { name: '海豚', sales: 16200, yoy: -1.5 }] },
        { id: 6, quarter: 'Q2', region: '华北', models: [{ name: '元', sales: 13400, yoy: 8.9 }, { name: '宋', sales: 23100, yoy: 10.3 }] },
        { id: 7, quarter: 'Q3', region: '华南', models: [{ name: '秦', sales: 38000, yoy: 16.2 }, { name: '汉', sales: 45800, yoy: 22.5 }] },
        { id: 8, quarter: 'Q3', region: '华东', models: [{ name: '唐', sales: 20300, yoy: 8.4 }, { name: '海豚', sales: 16800, yoy: 0.5 }] },
        { id: 9, quarter: 'Q3', region: '华北', models: [{ name: '元', sales: 14000, yoy: 10.2 }, { name: '宋', sales: 24000, yoy: 11.8 }] },
        { id: 10, quarter: 'Q4', region: '华南', models: [{ name: '秦', sales: 39800, yoy: 18.9 }, { name: '汉', sales: 48100, yoy: 24.7 }] },
        { id: 11, quarter: 'Q4', region: '华东', models: [{ name: '唐', sales: 21200, yoy: 10.1 }, { name: '海豚', sales: 17500, yoy: 2.3 }] },
        { id: 12, quarter: 'Q4', region: '华北', models: [{ name: '元', sales: 14700, yoy: 12.6 }, { name: '宋', sales: 25000, yoy: 13.5 }] },
        { id: 13, quarter: 'Q1', region: '西南', models: [{ name: '海豹', sales: 12300, yoy: 15.7 }, { name: '驱逐舰', sales: 8900, yoy: 22.4 }] },
        { id: 14, quarter: 'Q2', region: '西南', models: [{ name: '海豹', sales: 13100, yoy: 17.3 }, { name: '驱逐舰', sales: 9400, yoy: 24.8 }] }
    ];

    // DOM 引用
    const salesTableBody = document.getElementById('sales-table-body');
    const emptyState = document.getElementById('empty-state');
    const addSalesBtn = document.getElementById('add-sales-btn');
    const addFirstDataBtn = document.getElementById('add-first-data-btn');
    const salesModal = document.getElementById('sales-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalClose = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('cancel-btn');
    const saveBtn = document.getElementById('save-btn');
    const quarterSelect = document.getElementById('quarter-select');
    const regionSelect = document.getElementById('region-select');
    const modelEntriesContainer = document.getElementById('model-entries-container');
    const addModelBtn = document.getElementById('add-model-btn');
    const editIdInput = document.getElementById('edit-id');
    const deleteModal = document.getElementById('delete-modal');
    const deleteModalClose = document.getElementById('delete-modal-close');
    const deleteConfirmBtn = document.getElementById('delete-confirm-btn');
    const deleteCancelBtn = document.getElementById('delete-cancel-btn');
    const toastContainer = document.getElementById('toast-container');
    const searchInput = document.getElementById('search-input');
    const quarterFilter = document.getElementById('quarter-filter');
    const selectedQuarter = document.getElementById('selected-quarter');
    const totalSalesEl = document.getElementById('total-sales');
    const qoqGrowthEl = document.getElementById('qoq-growth');
    const topModelEl = document.getElementById('top-model');
    const avgSalesEl = document.getElementById('avg-sales');

    let currentData = [...salesData];
    let pageSize = 10;
    let currentPage = 1;
    let selectedDeleteId = null;
    let selectedFilterQuarter = 'all';
    let searchTerm = '';

    // 初始化
    function init() {
        renderSalesTable();
        updateStatistics();
        setupEventListeners();
        renderPagination();
    }

    // 更新统计数据
    function updateStatistics() {
        // 总销量
        const totalSales = currentData.reduce((sum, item) => {
            const modelSum = item.models.reduce((ms, model) => ms + model.sales, 0);
            return sum + modelSum;
        }, 0);
        totalSalesEl.textContent = totalSales.toLocaleString();

        // 计算环比增长
        const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
        const quarterTotals = {};
        
        quarters.forEach(q => {
            const quarterData = currentData.filter(item => item.quarter === q);
            quarterTotals[q] = quarterData.reduce((sum, item) => {
                return sum + item.models.reduce((ms, model) => ms + model.sales, 0);
            }, 0);
        });
        
        let qoqGrowth = 0;
        if (quarterTotals['Q3'] > 0 && quarterTotals['Q4'] > 0) {
            qoqGrowth = ((quarterTotals['Q4'] - quarterTotals['Q3']) / quarterTotals['Q3'] * 100).toFixed(1);
        }
        
        qoqGrowthEl.textContent = qoqGrowth + '%';
        if (parseFloat(qoqGrowth) > 0) {
            qoqGrowthEl.classList.add('positive');
            qoqGrowthEl.classList.remove('negative');
        } else if (parseFloat(qoqGrowth) < 0) {
            qoqGrowthEl.classList.add('negative');
            qoqGrowthEl.classList.remove('positive');
        } else {
            qoqGrowthEl.classList.remove('positive', 'negative');
        }

        // 最畅销车型
        const modelSales = {};
        currentData.forEach(item => {
            item.models.forEach(model => {
                if (!modelSales[model.name]) {
                    modelSales[model.name] = 0;
                }
                modelSales[model.name] += model.sales;
            });
        });

        let topModel = '';
        let maxSales = 0;
        for (const [model, sales] of Object.entries(modelSales)) {
            if (sales > maxSales) {
                maxSales = sales;
                topModel = model;
            }
        }
        
        topModelEl.textContent = topModel || '-';

        // 平均单车销量
        let totalModels = 0;
        currentData.forEach(item => {
            totalModels += item.models.length;
        });
        
        const avgSales = totalModels > 0 ? Math.round(totalSales / totalModels) : 0;
        avgSalesEl.textContent = avgSales.toLocaleString();
    }

    // 渲染销售数据表格
    function renderSalesTable() {
        // 过滤数据
        let filteredData = [...salesData];
        
        if (selectedFilterQuarter !== 'all') {
            filteredData = filteredData.filter(item => item.quarter === selectedFilterQuarter);
        }
        
        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase().trim();
            filteredData = filteredData.filter(item => 
                item.region.toLowerCase().includes(term) || 
                item.quarter.toLowerCase().includes(term) ||
                item.models.some(model => model.name.toLowerCase().includes(term))
            );
        }
        
        currentData = filteredData;
        
        if (currentData.length === 0) {
            salesTableBody.innerHTML = '';
            emptyState.style.display = 'flex';
            document.getElementById('pagination-container').style.display = 'none';
            return;
        }
        
        emptyState.style.display = 'none';
        document.getElementById('pagination-container').style.display = 'flex';
        
        // 分页
        const startIndex = (currentPage - 1) * pageSize;
        const paginatedData = currentData.slice(startIndex, startIndex + pageSize);
        
        salesTableBody.innerHTML = '';
        
        paginatedData.forEach(item => {
            const row = document.createElement('tr');
            
            // 获取该项的所有车型名称和销量
            const modelNames = item.models.map(m => m.name).join(', ');
            const totalSales = item.models.reduce((sum, m) => sum + m.sales, 0);
            
            // 计算环比变化
            const previousQuarterIndex = ['Q1', 'Q2', 'Q3', 'Q4'].indexOf(item.quarter) - 1;
            const previousQuarter = previousQuarterIndex >= 0 ? ['Q1', 'Q2', 'Q3', 'Q4'][previousQuarterIndex] : null;
            
            let qoqChange = '';
            if (previousQuarter) {
                const previousData = salesData.find(d => d.quarter === previousQuarter && d.region === item.region);
                if (previousData) {
                    const previousTotal = previousData.models.reduce((sum, m) => sum + m.sales, 0);
                    const changePercent = previousTotal > 0 
                        ? ((totalSales - previousTotal) / previousTotal * 100).toFixed(1) 
                        : '0.0';
                    
                    qoqChange = `
                        <span class="${parseFloat(changePercent) > 0 ? 'positive' : parseFloat(changePercent) < 0 ? 'negative' : ''}">
                            ${parseFloat(changePercent) > 0 ? '+' : ''}${changePercent}%
                            ${parseFloat(changePercent) > 0 
                                ? '<i class="fas fa-arrow-up"></i>' 
                                : parseFloat(changePercent) < 0 
                                    ? '<i class="fas fa-arrow-down"></i>' 
                                    : ''}
                        </span>
                    `;
                }
            }
            
            row.innerHTML = `
                <td data-label="车型">${modelNames}</td>
                <td data-label="季度">${item.quarter}</td>
                <td data-label="销售区域">${item.region}</td>
                <td data-label="销量">${totalSales.toLocaleString()}</td>
                <td data-label="环比变化">${qoqChange}</td>
                <td data-label="操作">
                    <div class="action-buttons">
                        <button class="btn-icon edit-btn" data-id="${item.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-btn" data-id="${item.id}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            `;
            
            salesTableBody.appendChild(row);
        });
        
        // 更新分页信息
        document.getElementById('pagination-info').textContent = 
            `显示 ${startIndex + 1}-${Math.min(startIndex + pageSize, currentData.length)} 条，共 ${currentData.length} 条`;
            
        renderPagination();
    }

    // 渲染分页控件
    function renderPagination() {
        const paginationControls = document.getElementById('pagination-controls');
        paginationControls.innerHTML = '';
        
        const totalPages = Math.ceil(currentData.length / pageSize);
        
        if (totalPages <= 1) {
            return;
        }
        
        // 上一页按钮
        const prevBtn = document.createElement('button');
        prevBtn.className = `pagination-btn prev ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderSalesTable();
            }
        });
        paginationControls.appendChild(prevBtn);
        
        // 页码按钮
        const maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
        
        if (endPage - startPage + 1 < maxButtons && startPage > 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-btn page-number ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderSalesTable();
            });
            paginationControls.appendChild(pageBtn);
        }
        
        // 下一页按钮
        const nextBtn = document.createElement('button');
        nextBtn.className = `pagination-btn next ${currentPage === totalPages ? 'disabled' : ''}`;
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderSalesTable();
            }
        });
        paginationControls.appendChild(nextBtn);
    }

    // 添加车型输入行
    function addModelEntry(modelName = '', sales = '', yoy = '') {
        const template = document.getElementById('model-entry-template');
        const newEntry = template.cloneNode(true);
        newEntry.id = '';
        newEntry.classList.remove('template');
        
        const modelSelect = newEntry.querySelector('.model-select');
        const salesInput = newEntry.querySelector('.sales-input');
        const yoyInput = newEntry.querySelector('.yoy-input');
        const removeBtn = newEntry.querySelector('.remove-model-btn');
        
        if (modelName) {
            // 如果提供了车型名，设置选择框
            for (let i = 0; i < modelSelect.options.length; i++) {
                if (modelSelect.options[i].value === modelName) {
                    modelSelect.selectedIndex = i;
                    break;
                }
            }
        }
        
        salesInput.value = sales;
        yoyInput.value = yoy;
        
        // 添加移除按钮点击事件
        removeBtn.addEventListener('click', function() {
            const entries = document.querySelectorAll('#model-entries-container .model-entry:not(.template)');
            if (entries.length > 1) {
                newEntry.remove();
            } else {
                showToast('至少需要保留一个车型', 'warning');
            }
        });
        
        modelEntriesContainer.appendChild(newEntry);
        return newEntry;
    }

    // 重置模态框表单
    function resetModalForm() {
        quarterSelect.value = '';
        regionSelect.value = '';
        editIdInput.value = '';
        
        // 清空车型条目
        const entries = document.querySelectorAll('#model-entries-container .model-entry:not(.template)');
        entries.forEach(entry => entry.remove());
        
        // 添加一个空的车型条目
        addModelEntry();
        
        // 重置模态框标题
        modalTitle.textContent = '添加销售数据';
    }

    // 显示编辑模态框
    function showEditModal(id = null) {
        resetModalForm();
        
        if (id !== null) {
            const item = salesData.find(item => item.id === id);
            if (item) {
                modalTitle.textContent = '编辑销售数据';
                editIdInput.value = id;
                quarterSelect.value = item.quarter;
                regionSelect.value = item.region;
                
                // 移除默认添加的空条目
                const entries = document.querySelectorAll('#model-entries-container .model-entry:not(.template)');
                entries.forEach(entry => entry.remove());
                
                // 添加已有的车型条目
                item.models.forEach(model => {
                    addModelEntry(model.name, model.sales, model.yoy);
                });
            }
        }
        
        salesModal.classList.add('show');
    }

    // 显示删除确认模态框
    function showDeleteModal(id) {
        selectedDeleteId = id;
        deleteModal.classList.add('show');
    }

    // 显示通知
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-exclamation-circle'}"></i>
            </div>
            <div class="toast-content">${message}</div>
            <button class="toast-close">&times;</button>
        `;
        
        toastContainer.appendChild(toast);
        
        // 添加关闭按钮事件
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            toast.classList.add('hiding');
            setTimeout(() => {
                toast.remove();
            }, 300);
        });
        
        // 自动关闭
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // 保存销售数据
    function saveSalesData() {
        const quarter = quarterSelect.value;
        const region = regionSelect.value;
        const editId = editIdInput.value ? parseInt(editIdInput.value) : null;
        
        if (!quarter || !region) {
            showToast('请选择季度和销售区域', 'error');
            return;
        }
        
        const modelEntries = document.querySelectorAll('#model-entries-container .model-entry:not(.template)');
        const models = [];
        let isValid = true;
        
        modelEntries.forEach(entry => {
            const modelSelect = entry.querySelector('.model-select');
            const salesInput = entry.querySelector('.sales-input');
            const yoyInput = entry.querySelector('.yoy-input');
            
            const modelName = modelSelect.value;
            const sales = salesInput.value ? parseInt(salesInput.value) : null;
            const yoy = yoyInput.value ? parseFloat(yoyInput.value) : null;
            
            if (!modelName || sales === null) {
                isValid = false;
                showToast('请填写完整的车型和销量数据', 'error');
                return;
            }
            
            models.push({
                name: modelName,
                sales: sales,
                yoy: yoy
            });
        });
        
        if (!isValid || models.length === 0) {
            return;
        }
        
        // 验证是否有重复的车型
        const modelNames = models.map(m => m.name);
        if (new Set(modelNames).size !== modelNames.length) {
            showToast('车型不能重复', 'error');
            return;
        }
        
        if (editId !== null) {
            // 编辑现有数据
            const index = salesData.findIndex(item => item.id === editId);
            if (index !== -1) {
                salesData[index].quarter = quarter;
                salesData[index].region = region;
                salesData[index].models = models;
                showToast('销售数据已更新', 'success');
            }
        } else {
            // 添加新数据
            const newId = salesData.length > 0 ? Math.max(...salesData.map(item => item.id)) + 1 : 1;
            salesData.push({
                id: newId,
                quarter: quarter,
                region: region,
                models: models
            });
            showToast('销售数据已添加', 'success');
        }
        
        salesModal.classList.remove('show');
        currentPage = 1;  // 重置到第一页
        renderSalesTable();
        updateStatistics();
    }

    // 删除销售数据
    function deleteSalesData(id) {
        const index = salesData.findIndex(item => item.id === id);
        if (index !== -1) {
            salesData.splice(index, 1);
            showToast('销售数据已删除', 'success');
            
            // 如果当前页没有数据了，且不是第一页，则返回上一页
            if (salesData.length > 0 && currentPage > 1 && (currentPage - 1) * pageSize >= currentData.length) {
                currentPage--;
            }
            
            renderSalesTable();
            updateStatistics();
        }
        
        deleteModal.classList.remove('show');
    }

    // 初始化下拉菜单
    function initDropdowns() {
        // 获取所有下拉菜单
        const dropdowns = document.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            // 切换下拉菜单显示状态
            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // 关闭其他下拉菜单
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.querySelector('.dropdown-menu').classList.remove('show');
                    }
                });
                
                menu.classList.toggle('show');
            });
            
            // 点击菜单项
            const items = menu.querySelectorAll('.dropdown-item');
            items.forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // 处理季度过滤器菜单项点击
                    if (dropdown.id === 'quarter-filter') {
                        items.forEach(i => i.classList.remove('active'));
                        item.classList.add('active');
                        
                        const value = item.getAttribute('data-value');
                        selectedQuarter.textContent = item.textContent;
                        selectedFilterQuarter = value;
                        currentPage = 1;  // 重置到第一页
                        renderSalesTable();
                        updateStatistics();
                    }
                    
                    menu.classList.remove('show');
                });
            });
        });
        
        // 点击文档其他部分关闭下拉菜单
        document.addEventListener('click', function(e) {
            dropdowns.forEach(dropdown => {
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu.classList.contains('show')) {
                    menu.classList.remove('show');
                }
            });
        });
    }

    // 设置事件监听器
    function setupEventListeners() {
        // 添加销售数据按钮
        addSalesBtn.addEventListener('click', () => showEditModal());
        addFirstDataBtn.addEventListener('click', () => showEditModal());
        
        // 模态框关闭按钮
        modalClose.addEventListener('click', () => salesModal.classList.remove('show'));
        cancelBtn.addEventListener('click', () => salesModal.classList.remove('show'));
        
        // 删除模态框按钮
        deleteModalClose.addEventListener('click', () => deleteModal.classList.remove('show'));
        deleteCancelBtn.addEventListener('click', () => deleteModal.classList.remove('show'));
        deleteConfirmBtn.addEventListener('click', () => deleteSalesData(selectedDeleteId));
        
        // 保存按钮
        saveBtn.addEventListener('click', saveSalesData);
        
        // 添加车型按钮
        addModelBtn.addEventListener('click', () => addModelEntry());
        
        // 搜索框
        searchInput.addEventListener('input', function() {
            searchTerm = this.value;
            currentPage = 1;  // 重置到第一页
            renderSalesTable();
        });
        
        // 表格中的编辑/删除按钮
        salesTableBody.addEventListener('click', function(e) {
            const editBtn = e.target.closest('.edit-btn');
            const deleteBtn = e.target.closest('.delete-btn');
            
            if (editBtn) {
                const id = parseInt(editBtn.getAttribute('data-value') || editBtn.getAttribute('data-id'));
                showEditModal(id);
            }
            
            if (deleteBtn) {
                const id = parseInt(deleteBtn.getAttribute('data-value') || deleteBtn.getAttribute('data-id'));
                showDeleteModal(id);
            }
        });
        
        // 导出按钮
        document.getElementById('export-excel').addEventListener('click', function(e) {
            e.preventDefault();
            showToast('正在导出Excel文件...', 'success');
        });
        
        document.getElementById('export-csv').addEventListener('click', function(e) {
            e.preventDefault();
            showToast('正在导出CSV文件...', 'success');
        });
        
        document.getElementById('export-pdf').addEventListener('click', function(e) {
            e.preventDefault();
            showToast('正在导出PDF文件...', 'success');
        });
        
        // 模态框外点击关闭
        salesModal.addEventListener('click', function(e) {
            if (e.target === salesModal) {
                salesModal.classList.remove('show');
            }
        });
        
        deleteModal.addEventListener('click', function(e) {
            if (e.target === deleteModal) {
                deleteModal.classList.remove('show');
            }
        });

        // 初始化下拉菜单
        initDropdowns();
    }

    // 初始化页面
    init();
}); 