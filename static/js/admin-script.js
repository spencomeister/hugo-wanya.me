/**
 * WANYA Admin Settings JavaScript
 * Handles dynamic functionality for the admin interface
 */

jQuery(document).ready(function($) {
    
    // Image Upload Functionality
    $('.upload-image-button').on('click', function(e) {
        e.preventDefault();
        
        const button = $(this);
        const inputField = button.siblings('input[type="hidden"]');
        const preview = button.siblings('.image-preview');
        
        const mediaUploader = wp.media({
            title: '画像を選択',
            button: {
                text: '選択'
            },
            multiple: false
        });
        
        mediaUploader.on('select', function() {
            const attachment = mediaUploader.state().get('selection').first().toJSON();
            inputField.val(attachment.url);
            preview.html('<img src="' + attachment.url + '" alt="Selected Image" style="max-width: 200px; height: auto;">');
            button.siblings('.remove-image-button').show();
        });
        
        mediaUploader.open();
    });
    
    // Remove Image
    $('.remove-image-button').on('click', function(e) {
        e.preventDefault();
        
        const button = $(this);
        const inputField = button.siblings('input[type="hidden"]');
        const preview = button.siblings('.image-preview');
        
        inputField.val('');
        preview.html('<div class="no-image">画像が選択されていません</div>');
        button.hide();
    });
    
    // Specialty Management
    let specialtyCounter = $('#specialties-container .specialty-item').length;
    
    $('#add-specialty').on('click', function() {
        const container = $('#specialties-container');
        const newIndex = specialtyCounter;
        
        const specialtyHtml = `
            <div class="specialty-item">
                <input type="text" name="specialties[${newIndex}][emoji]" placeholder="🎨" maxlength="2" class="emoji-input" />
                <input type="text" name="specialties[${newIndex}][text]" placeholder="イラスト制作" class="specialty-text" />
                <button type="button" class="button remove-specialty">削除</button>
            </div>
        `;
        
        container.append(specialtyHtml);
        specialtyCounter++;
        
        // Focus on the new emoji input
        container.find('.specialty-item:last .emoji-input').focus();
    });
    
    // Remove Specialty
    $(document).on('click', '.remove-specialty', function() {
        if ($('#specialties-container .specialty-item').length > 1) {
            $(this).closest('.specialty-item').fadeOut(300, function() {
                $(this).remove();
            });
        } else {
            // Clear inputs instead of removing the last item
            $(this).closest('.specialty-item').find('input').val('');
        }
    });
    
    // Tool Management
    let toolCounter = $('#tools-container .tool-item').length;
    
    $('#add-tool').on('click', function() {
        const container = $('#tools-container');
        
        const toolHtml = `
            <div class="tool-item">
                <input type="text" name="tools[]" placeholder="Adobe Photoshop" class="tool-input" />
                <button type="button" class="button remove-tool">削除</button>
            </div>
        `;
        
        container.append(toolHtml);
        toolCounter++;
        
        // Focus on the new tool input
        container.find('.tool-item:last .tool-input').focus();
    });
    
    // Remove Tool
    $(document).on('click', '.remove-tool', function() {
        if ($('#tools-container .tool-item').length > 1) {
            $(this).closest('.tool-item').fadeOut(300, function() {
                $(this).remove();
            });
        } else {
            // Clear input instead of removing the last item
            $(this).closest('.tool-item').find('input').val('');
        }
    });
    
    // Achievement Management
    let achievementCounter = $('#achievements-container .achievement-item').length;
    
    $('#add-achievement').on('click', function() {
        const container = $('#achievements-container');
        const newIndex = achievementCounter;
        
        const achievementHtml = `
            <div class="achievement-item">
                <input type="text" name="achievements[${newIndex}][title]" placeholder="実績タイトル" class="achievement-title" />
                <textarea name="achievements[${newIndex}][description]" placeholder="実績の詳細説明" class="achievement-description"></textarea>
                <input type="date" name="achievements[${newIndex}][date]" class="achievement-date" />
                <button type="button" class="button remove-achievement">削除</button>
            </div>
        `;
        
        container.append(achievementHtml);
        achievementCounter++;
        
        // Focus on the new title input
        container.find('.achievement-item:last .achievement-title').focus();
    });
    
    // Remove Achievement
    $(document).on('click', '.remove-achievement', function() {
        if (confirm('この実績を削除しますか？')) {
            if ($('#achievements-container .achievement-item').length > 1) {
                $(this).closest('.achievement-item').fadeOut(300, function() {
                    $(this).remove();
                });
            } else {
                // Clear inputs instead of removing the last item
                $(this).closest('.achievement-item').find('input, textarea').val('');
            }
        }
    });
    
    // Works Section Management
    let sectionCounter = $('#works-sections-container .section-item').length;
    
    $('#add-works-section').on('click', function() {
        const container = $('#works-sections-container');
        const newIndex = sectionCounter;
        
        const sectionHtml = `
            <div class="section-item" data-index="${newIndex}">
                <div class="section-header">
                    <h4>セクション #${newIndex + 1}</h4>
                    <div class="section-controls">
                        <button type="button" class="button move-up">↑</button>
                        <button type="button" class="button move-down">↓</button>
                        <button type="button" class="button remove-section">削除</button>
                    </div>
                </div>
                <table class="form-table">
                    <tr>
                        <th><label>セクション名</label></th>
                        <td><input type="text" name="works_sections[${newIndex}][name]" value="" class="regular-text"></td>
                    </tr>
                    <tr>
                        <th><label>アイコン（絵文字）</label></th>
                        <td><input type="text" name="works_sections[${newIndex}][icon]" value="🎨" class="small-text" placeholder="🎨"></td>
                    </tr>
                    <tr>
                        <th><label>説明</label></th>
                        <td><textarea name="works_sections[${newIndex}][description]" rows="2" class="large-text"></textarea></td>
                    </tr>
                </table>
            </div>
        `;
        
        container.append(sectionHtml);
        sectionCounter++;
        
        // Focus on the new section name input
        container.find('.section-item:last .regular-text:first').focus();
    });
    
    // Remove Works Section
    $(document).on('click', '.remove-section', function() {
        if (confirm('このセクションを削除しますか？')) {
            $(this).closest('.section-item').fadeOut(300, function() {
                $(this).remove();
                updateSectionNumbers();
            });
        }
    });
    
    // Move section up
    $(document).on('click', '.move-up', function() {
        const section = $(this).closest('.section-item');
        const prev = section.prev('.section-item');
        
        if (prev.length) {
            section.fadeOut(200, function() {
                section.insertBefore(prev).fadeIn(200);
                updateSectionNumbers();
            });
        }
    });
    
    // Move section down
    $(document).on('click', '.move-down', function() {
        const section = $(this).closest('.section-item');
        const next = section.next('.section-item');
        
        if (next.length) {
            section.fadeOut(200, function() {
                section.insertAfter(next).fadeIn(200);
                updateSectionNumbers();
            });
        }
    });
    
    // Update section numbers after reordering/removal
    function updateSectionNumbers() {
        $('#works-sections-container .section-item').each(function(index) {
            $(this).find('h4').text('セクション #' + (index + 1));
            
            // Update form field names
            $(this).find('input, textarea').each(function() {
                const name = $(this).attr('name');
                if (name) {
                    const newName = name.replace(/\[\d+\]/, '[' + index + ']');
                    $(this).attr('name', newName);
                }
            });
        });
    }
    
    // Form Validation - Only for specific forms, not all forms
    $('#wanya-about-form').on('submit', function(e) {
        let isValid = true;
        const requiredFields = $(this).find('input[required], textarea[required]');
        
        requiredFields.each(function() {
            if (!$(this).val().trim()) {
                $(this).addClass('error');
                isValid = false;
            } else {
                $(this).removeClass('error');
            }
        });
        
        if (!isValid) {
            alert('必須項目を入力してください。');
            return false;
        }
        
        return true;
    });
    
    // Real-time form field validation
    $('input, textarea').on('blur', function() {
        if ($(this).attr('required') && !$(this).val().trim()) {
            $(this).addClass('error');
        } else {
            $(this).removeClass('error');
        }
    });
    
    // Auto-save functionality (optional)
    let autoSaveTimeout;
    
    function scheduleAutoSave() {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(function() {
            // Could implement auto-save here
        }, 2000);
    }
    
    // Detect changes for auto-save
    $('input, textarea').on('input', scheduleAutoSave);
    
    // Smooth scrolling for navigation
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        
        const target = $($(this).attr('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 50
            }, 500);
        }
    });
    
    // Add loading states to buttons (except for works form which has its own handler)
    $('.wanya-admin-wrap form:not(#works-carousel-form)').on('submit', function() {
        const submitButton = $(this).find('input[type="submit"]');
        submitButton.val('保存中...').prop('disabled', true);
        
        setTimeout(function() {
            submitButton.val('設定を保存').prop('disabled', false);
        }, 2000);
    });
    
    // Sortable functionality for reordering (if jQuery UI is available)
    if ($.fn.sortable) {
        $('#achievements-container, #works-sections-container').sortable({
            handle: '.achievement-header, .section-header',
            axis: 'y',
            placeholder: 'sortable-placeholder',
            update: function() {
                if ($(this).attr('id') === 'achievements-container') {
                    updateAchievementNumbers();
                } else {
                    updateSectionNumbers();
                }
            }
        });
    }
    
    // Confirmation dialogs for destructive actions
    $('.remove-achievement, .remove-section, .btn-delete').on('click', function(e) {
        const action = $(this).text();
        const message = `この操作（${action}）を実行しますか？`;
        
        if (!confirm(message)) {
            e.preventDefault();
            return false;
        }
    });
    
    // Enhanced form field styling
    $('input, textarea, select').on('focus', function() {
        $(this).closest('.form-table tr, .price-item').addClass('focused');
    }).on('blur', function() {
        $(this).closest('.form-table tr, .price-item').removeClass('focused');
    });
    
    // Copy functionality for sharing settings
    $('.copy-settings').on('click', function() {
        const settingsData = $(this).data('settings');
        
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(JSON.stringify(settingsData));
            alert('設定がクリップボードにコピーされました！');
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = JSON.stringify(settingsData);
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('設定がクリップボードにコピーされました！');
        }
    });
    
    // Keyboard shortcuts
    $(document).on('keydown', function(e) {
        // Ctrl+S to save
        if (e.ctrlKey && e.which === 83) {
            e.preventDefault();
            $('.wanya-admin-wrap form').submit();
        }
        
        // Escape to close modals/dialogs
        if (e.which === 27) {
            $('.template-buttons').remove();
        }
    });
    
    // Initialize tooltips if available
    if ($.fn.tooltip) {
        $('[title]').tooltip({
            position: { my: 'center bottom-20', at: 'center top' }
        });
    }
    
    // Tab navigation enhancement
    $('input, textarea, button').on('keydown', function(e) {
        if (e.which === 9) { // Tab key
            // Enhanced tab navigation could be implemented here
        }
    });
    
    // Progress indicator for forms with many fields
    function updateProgressIndicator() {
        const form = $('.wanya-admin-wrap form');
        const totalFields = form.find('input:not([type="hidden"]), textarea').length;
        const completedFields = form.find('input:not([type="hidden"]):not([value=""]), textarea:not(:empty)').length;
        const progress = Math.round((completedFields / totalFields) * 100);
        
        $('.progress-indicator').text(`完了度: ${progress}%`);
    }
    
    // Update progress on field changes
    $('input, textarea').on('input', updateProgressIndicator);
    
    // Initialize progress indicator if container exists
    if ($('.progress-indicator').length) {
        updateProgressIndicator();
    }
    

    
    // Works Carousel Management
    initWorksCarouselManagement();
    
    function initWorksCarouselManagement() {
        
        // Make items sortable
        if ($('#carousel-items-container').length) {
            $('#carousel-items-container').sortable({
                handle: '.drag-handle',
                placeholder: 'ui-sortable-placeholder',
                start: function(e, ui) {
                    ui.placeholder.height(ui.item.height());
                },
                update: function() {
                    updateItemIndices();
                }
            });
        }
        
        // Toggle item content
        $(document).on('click', '.carousel-item-header', function(e) {
            if ($(e.target).hasClass('button') || $(e.target).closest('.button').length) {
                return; // Don't toggle if clicking buttons
            }
            
            const content = $(this).next('.carousel-item-content');
            content.toggleClass('open').slideToggle(300);
            
            const toggleBtn = $(this).find('.toggle-item');
            toggleBtn.text(content.hasClass('open') ? '閉じる' : '開く');
        });
        
        // Add new carousel item
        $('#add-carousel-item').on('click', function() {
            addNewCarouselItem();
        });
        
        // Remove carousel item
        $(document).on('click', '.remove-item', function(e) {
            e.stopPropagation();
            if (confirm('この項目を削除しますか？')) {
                $(this).closest('.carousel-item-row').slideUp(300, function() {
                    $(this).remove();
                    updateItemIndices();
                    checkEmptyState();
                });
            }
        });
        
        // Image upload for carousel items
        $(document).on('click', '.upload-image', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = $(this);
            const container = button.closest('.image-upload-section');
            const inputField = container.find('.image-url');
            const preview = container.find('.image-preview');
            
            const mediaUploader = wp.media({
                title: '作品画像を選択',
                button: {
                    text: '選択'
                },
                multiple: false,
                library: {
                    type: 'image'
                }
            });
            
            mediaUploader.on('select', function() {
                const attachment = mediaUploader.state().get('selection').first().toJSON();
                
                inputField.val(attachment.url);
                preview.html('<img src="' + attachment.url + '" alt="プレビュー" style="max-width: 200px; height: auto;">');
                container.find('.remove-image').show();
            });
            
            mediaUploader.open();
        });
        
        // Remove image for carousel items
        $(document).on('click', '.remove-image', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = $(this);
            const container = button.closest('.image-upload-section');
            const inputField = container.find('.image-url');
            const preview = container.find('.image-preview');
            
            inputField.val('');
            preview.html('<div class="no-image-placeholder">画像なし</div>');
            button.hide();
        });
        
        // Media type switching for carousel items
        $(document).on('change', 'input[name*="[media_type]"]', function() {
            const mediaType = $(this).val();
            const container = $(this).closest('.media-upload-section');
            const imageSection = container.find('.image-upload-section');
            const videoSection = container.find('.video-upload-section');
            
            if (mediaType === 'image') {
                imageSection.show();
                videoSection.hide();
                // Clear video data
                videoSection.find('.video-url').val('');
                videoSection.find('.video-preview').html('<div class="no-video-placeholder">動画なし</div>');
            } else if (mediaType === 'video') {
                imageSection.hide();
                videoSection.show();
                // Clear image data
                imageSection.find('.image-url').val('');
                imageSection.find('.image-preview').html('<div class="no-image-placeholder">画像なし</div>');
            }
        });

        // Video upload for carousel items
        $(document).on('click', '.upload-video', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = $(this);
            const container = button.closest('.video-upload-section');
            const inputField = container.find('.video-url');
            const preview = container.find('.video-preview');
            
            const mediaUploader = wp.media({
                title: '作品動画を選択',
                button: {
                    text: '選択'
                },
                multiple: false,
                library: {
                    type: 'video'
                }
            });
            
            mediaUploader.on('select', function() {
                const attachment = mediaUploader.state().get('selection').first().toJSON();
                
                inputField.val(attachment.url);
                preview.html('<video controls style="max-width: 200px; height: auto;"><source src="' + attachment.url + '" type="video/mp4">Your browser does not support the video tag.</video>');
                container.find('.remove-video').show();
            });
            
            mediaUploader.open();
        });
        
        // Remove video for carousel items
        $(document).on('click', '.remove-video', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = $(this);
            const container = button.closest('.video-upload-section');
            const inputField = container.find('.video-url');
            const preview = container.find('.video-preview');
            
            inputField.val('');
            preview.html('<div class="no-video-placeholder">動画なし</div>');
            button.hide();
        });
        
        // Update item title in header when typing
        $(document).on('input', '.item-title', function() {
            const title = $(this).val() || '新しい項目';
            $(this).closest('.carousel-item-row').find('.carousel-item-header h4').text(title);
        });
        
        // Preview carousel functionality
        $('#preview-carousel').on('click', function() {
            window.open('/works/', '_blank');
        });
        
        // Initial setup
        updateItemIndices();
        checkEmptyState();
        
        // Open first item by default if there are items
        const firstItem = $('.carousel-item-row').first();
        if (firstItem.length) {
            firstItem.find('.carousel-item-content').addClass('open').show();
            firstItem.find('.toggle-item').text('閉じる');
        }
    }
    
    function addNewCarouselItem() {
        const container = $('#carousel-items-container');
        const template = $('#carousel-item-template').html();
        const currentCount = container.find('.carousel-item-row').length;
        const newIndex = currentCount;
        const newOrder = currentCount + 1;
        
        // Replace template placeholders
        const newItemHtml = template
            .replace(/__INDEX__/g, newIndex)
            .replace(/__ORDER__/g, newOrder);
        
        const newItem = $(newItemHtml);
        
        // Add with animation
        newItem.hide().appendTo(container).slideDown(300, function() {
            // Open the new item
            $(this).find('.carousel-item-content').addClass('open').show();
            $(this).find('.toggle-item').text('閉じる');
            
            // Focus on title field
            $(this).find('.item-title').focus();
        });
        
        updateItemIndices();
        checkEmptyState();
    }
    
    function updateItemIndices() {
        $('#carousel-items-container .carousel-item-row').each(function(index) {
            const item = $(this);
            item.attr('data-index', index);
            
            // Update order field value
            item.find('input[name*="[order]"]').val(index + 1);
            
            // Update form field names
            item.find('input, select, textarea').each(function() {
                const field = $(this);
                const name = field.attr('name');
                if (name && name.includes('[') && name.includes(']')) {
                    const newName = name.replace(/\[\d+\]/, '[' + index + ']');
                    field.attr('name', newName);
                }
            });
            
            // Update order field if empty
            const orderField = item.find('input[name*="[order]"]');
            if (!orderField.val()) {
                orderField.val(index + 1);
            }
        });
    }
    
    function checkEmptyState() {
        const container = $('#carousel-items-container');
        const emptyState = $('.empty-state');
        const hasItems = container.find('.carousel-item-row').length > 0;
        
        if (hasItems) {
            emptyState.hide();
        } else {
            emptyState.show();
        }
    }
    
    // Works form submission handling
    $('#works-carousel-form').on('submit', function(e) {
        let hasValidItems = false;
        let itemCount = 0;
        
        $('.carousel-item-row').each(function() {
            const title = $(this).find('.item-title').val();
            const image = $(this).find('.image-url').val();
            const video = $(this).find('.video-url').val();
            
            if (title.trim() || image.trim() || video.trim()) {
                hasValidItems = true;
            }
            itemCount++;
        });
        
        if (!hasValidItems && itemCount > 0) {
            alert('少なくとも1つの有効な項目（タイトルまたは画像/動画）を入力してください。');
            e.preventDefault();
            return false;
        }
        
        // Update submit button text but don't disable it immediately
        const submitButton = $(this).find('input[type="submit"]');
        
        // Use setTimeout to change button text after form starts submitting
        setTimeout(() => {
            submitButton.val('保存中...').prop('disabled', true);
        }, 100);
        
        // Re-enable button after form processes (if page doesn't reload)
        setTimeout(() => {
            submitButton.val('設定を保存').prop('disabled', false);
        }, 5000);
        
        // Allow normal form submission - do not prevent default
        return true;
    });
});

// Global functions for price management (integrated from price-management.php)
let sectionCounter = 0;
let itemCounters = {};

// Sample section templates for quick setup
const sectionTemplates = {
    'skeb': {
        title: '🎨 Skeb',
        items: [
            {name: 'バストアップ', price: 3000, description: '胸から上の構図'},
            {name: '半身', price: 4500, description: '腰から上の構図'},
            {name: '全身', price: 6000, description: '全身の構図'}
        ]
    },
    'illustration': {
        title: '✨ イラスト制作',
        items: [
            {name: 'バストアップ（線画）', price: 8000, description: 'モノクロ線画'},
            {name: 'バストアップ（カラー）', price: 12000, description: 'フルカラー'},
            {name: '半身（カラー）', price: 18000, description: '腰から上'}
        ]
    },
    'live2d': {
        title: '🎭 Live2D',
        items: [
            {name: '基本パッケージ', price: 80000, description: 'バストアップ、基本動作'},
            {name: '半身パッケージ', price: 120000, description: '腰から上、手の動き含む'}
        ]
    }
};

function addPriceSection(templateKey = null) {
    const container = document.getElementById('price-sections-container');
    if (!container) return;
    
    const sectionKey = 'section_' + Date.now();
    sectionCounter++;
    itemCounters[sectionKey] = 0;
    
    let sectionData = {
        title: '🆕 新しいセクション',
        items: []
    };
    
    if (templateKey && sectionTemplates[templateKey]) {
        sectionData = sectionTemplates[templateKey];
    }
    
    const sectionHtml = `
        <div class="price-section" data-section="${sectionKey}" style="animation: slideIn 0.3s ease-out;">
            <div class="section-header">
                <input type="text" name="price_sections[${sectionKey}][title]" 
                       value="${sectionData.title}" 
                       class="section-title-input" placeholder="セクションタイトル">
                <div class="section-controls">
                    <button type="button" class="btn btn-add-item" onclick="addPriceItem('${sectionKey}')" title="新しい項目を追加">+ 項目追加</button>
                    <button type="button" class="btn btn-delete" onclick="deleteSection('${sectionKey}')" title="このセクションを削除">セクション削除</button>
                </div>
            </div>
            <div class="items-container" id="items-${sectionKey}">
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', sectionHtml);
    
    // Add template items if provided
    if (sectionData.items.length > 0) {
        setTimeout(() => {
            sectionData.items.forEach(item => {
                addPriceItemWithData(sectionKey, item);
            });
        }, 100);
    }
    
    // Focus on the new section title
    setTimeout(() => {
        const titleInput = document.querySelector(`[data-section="${sectionKey}"] .section-title-input`);
        if (titleInput) {
            titleInput.focus();
            titleInput.select();
        }
    }, 150);
}

function deleteSection(sectionKey) {
    const section = document.querySelector(`[data-section="${sectionKey}"]`);
    if (!section) return;
    
    const itemCount = section.querySelectorAll('.price-item').length;
    
    let message = 'このセクションを削除しますか？';
    if (itemCount > 0) {
        message += `\n（${itemCount}個の項目も一緒に削除されます）`;
    }
    
    if (confirm(message)) {
        section.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => {
            section.remove();
            delete itemCounters[sectionKey];
        }, 300);
    }
}

function addPriceItem(sectionKey) {
    addPriceItemWithData(sectionKey, {
        name: '',
        price: 0,
        description: ''
    });
}

function addPriceItemWithData(sectionKey, itemData) {
    const container = document.getElementById(`items-${sectionKey}`);
    if (!container) return;
    
    if (!itemCounters[sectionKey]) itemCounters[sectionKey] = 0;
    
    const itemKey = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    itemCounters[sectionKey]++;
    
    const itemHtml = `
        <div class="price-item" data-item="${itemKey}">
            <input type="text" name="price_sections[${sectionKey}][items][${itemKey}][name]" 
                   value="${itemData.name}" 
                   class="item-name" placeholder="項目名（例：バストアップ、半身）">
            <div class="price-label">¥</div>
            <input type="number" name="price_sections[${sectionKey}][items][${itemKey}][price]" 
                   value="${itemData.price}" 
                   class="item-price" placeholder="価格" min="0" step="100">
            <input type="text" name="price_sections[${sectionKey}][items][${itemKey}][description]" 
                   value="${itemData.description}" 
                   class="item-description" placeholder="説明（例：胸から上の構図）">
            <div class="item-controls">
                <button type="button" class="btn btn-delete" onclick="deletePriceItem(this)" title="この項目を削除">削除</button>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', itemHtml);
    
    // Focus on the name input for new empty items
    if (!itemData.name) {
        setTimeout(() => {
            const nameInput = container.querySelector(`[data-item="${itemKey}"] .item-name`);
            if (nameInput) {
                nameInput.focus();
            }
        }, 100);
    }
}

function deletePriceItem(button) {
    const item = button.closest('.price-item');
    if (!item) return;
    
    const itemName = item.querySelector('.item-name').value || '無名の項目';
    
    if (confirm(`「${itemName}」を削除しますか？`)) {
        item.style.animation = 'fadeOut 0.3s ease-in';
        setTimeout(() => {
            item.remove();
        }, 300);
    }
}

function showSectionTemplates() {
    const container = document.querySelector('.add-section-container');
    if (!container) return;
    
    if (container.querySelector('.template-buttons')) {
        return; // Already showing
    }
    
    const templateButtons = document.createElement('div');
    templateButtons.className = 'template-buttons';
    templateButtons.style.marginTop = '15px';
    templateButtons.innerHTML = `
        <p style="margin-bottom: 10px; font-size: 14px; color: #666;">テンプレートから選択:</p>
        <button type="button" class="btn btn-add-item" onclick="addPriceSection('skeb')" style="margin: 5px;">🎨 Skeb</button>
        <button type="button" class="btn btn-add-item" onclick="addPriceSection('illustration')" style="margin: 5px;">✨ イラスト制作</button>
        <button type="button" class="btn btn-add-item" onclick="addPriceSection('live2d')" style="margin: 5px;">🎭 Live2D</button>
        <button type="button" class="btn btn-add" onclick="addPriceSection()" style="margin: 5px;">🆕 空のセクション</button>
        <br><button type="button" class="btn" onclick="hideSectionTemplates()" style="margin-top: 10px; background: #6c757d; color: white;">キャンセル</button>
    `;
    
    container.appendChild(templateButtons);
}

function hideSectionTemplates() {
    const templateButtons = document.querySelector('.template-buttons');
    if (templateButtons) {
        templateButtons.remove();
    }
}
