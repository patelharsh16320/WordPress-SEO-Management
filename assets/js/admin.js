jQuery(function ($) {
    let page = 1;
    /* =========================================
       LOAD IMAGES
    ========================================= */
    function loadImages() {
        $.post(smm_ajax.ajaxurl, {
            action: 'smm_fetch_images',
            page: page,
            per_page: $('#smm-per-page').val(),
            search: $('#smm-search').val(),
            blank: $('#smm-filter-alt').val() === 'blank' ? 1 : '',
            not_blank: $('#smm-filter-alt').val() === 'not-blank' ? 1 : ''
        }, function (res) {
            let html = '';
            let perPage = parseInt($('#smm-per-page').val());
            let startIndex = (page - 1) * perPage;
            if (!res.data.length) {
                html = `
                    <tr>
                        <td colspan="5">No images found</td>
                    </tr>
                `;
            } else {
                res.data.forEach((img, i) => {
                    let index = startIndex + i + 1;
                    html += `
                        <tr>
                            <td>${index}</td>
                            <td>
                                <img src="${img.url}" width="60" style="border-radius:6px;">
                            </td>
                          <td>
                            <input
                                type="text"
                                class="smm-image-title"
                                data-id="${img.id}"
                                value="${img.title || ''}"
                            >
                        </td>
                            <td>
                                <input 
                                    type="text"
                                    class="alt-input"
                                    data-id="${img.id}"
                                    value="${img.alt || ''}"
                                >
                            </td>
                            <td style="display: grid;">
                                <button class="save-alt" data-id="${img.id}">
                                    Save
                                </button>
                                <button class="clear-alt" data-id="${img.id}">
                                    Clear
                                </button>
                            </td>
                        </tr>
                    `;
                });
            }
            $('#smm-results').html(html);
            renderPagination(res.pages, res.current);
        });
    }
    /* =========================================
       PAGINATION
    ========================================= */
    function renderPagination(totalPages, currentPage) {
        let html = `<div class="smm-pagination">`;
        // PREV
        if (currentPage > 1) {
            html += `
                <button class="smm-page" data-page="${currentPage - 1}">
                    Prev
                </button>
            `;
        }
        // PAGE NUMBERS
        for (let i = 1; i <= totalPages; i++) {
            let active = i == currentPage ? 'active' : '';
            html += `
                <button 
                    class="smm-page ${active}" 
                    data-page="${i}"
                >
                    ${i}
                </button>
            `;
        }
        // NEXT
        if (currentPage < totalPages) {
            html += `
                <button class="smm-page" data-page="${currentPage + 1}">
                    Next
                </button>
            `;
        }
        html += `</div>`;
        $('#smm-pagination').html(html);
    }
    /* =========================================
       PAGINATION CLICK
    ========================================= */
    $(document).on('click', '.smm-page', function () {
        page = $(this).data('page');
        loadImages();
    });
    /* =========================================
       SAVE ALT
    ========================================= */
    $(document).on('click', '.save-alt', function () {
        let id = $(this).data('id');
        let alt = $(`.alt-input[data-id="${id}"]`).val();
        let title = $(`.smm-image-title[data-id="${id}"]`).val();
        $.post(smm_ajax.ajaxurl, {
            action: 'smm_update_alt',
            id: id,
            alt: alt,
            title: title
        }, function () {
            loadImages();
        });
    });
    /* =========================================
       CLEAR ALT
       (Frontend only)
    ========================================= */
    $(document).on('click', '.clear-alt', function () {
        let id = $(this).data('id');
        $(`.alt-input[data-id="${id}"]`).val('');
    });
    /* =========================================
       SEARCH / FILTER / PER PAGE
    ========================================= */
    $('#smm-search, #smm-per-page, #smm-filter-alt')
        .on('keyup change', function () {
            page = 1;
            loadImages();
        });
    /* =========================================
       CONTENT MANAGER
    ========================================= */
    $(document).on('change', '#smm-content-type', function () {
        let type = $(this).val();
        if (!type) {
            $('#smm-content-table').html(`
                <tr>
                    <td colspan="4">
                        Select Post or Page
                    </td>
                </tr>
            `);
            return;
        }
        $.post(smm_ajax.ajaxurl, {
            action: 'smm_get_content_by_type',
            type: type
        }, function (res) {
            let html = '';
            if (!res.length) {
                html = `
                    <tr>
                        <td colspan="4">
                            No content found
                        </td>
                    </tr>
                `;
            } else {
                res.forEach(item => {
                    html += `
                        <tr>
                            <td>${item.index}</td>
                            <td>${item.title}</td>
                            <td>${item.type}</td>
                            <td>
                                <a href="${item.link}" target="_blank">
                                    View
                                </a>
                            </td>
                        </tr>
                    `;
                });
            }
            $('#smm-content-table').html(html);
        });
    });
    if ($('#smm-results').length) {
        loadImages();
    }
    /* AUTO LOAD DEFAULT CONTENT TYPE */
    if ($('#smm-content-type').length) {
        $('#smm-content-type').trigger('change');
    }
    /* =========================================
   UPDATE ALL MEDIA
========================================= */
    $(document).on('click', '#smm-update-all-media', function () {
        let btn = $(this);
        btn.text('Updating...');
        let rows = $('#smm-results tr');
        let total = rows.length;
        let completed = 0;
        rows.each(function () {
            let row = $(this);
            let saveBtn = row.find('.save-alt');
            let id = saveBtn.data('id');
            if (!id) return;
            let alt = row.find('.alt-input').val();
            let title = row.find('.smm-image-title').val();
            $.post(smm_ajax.ajaxurl, {
                action: 'smm_update_alt',
                id: id,
                alt: alt,
                title: title
            }, function () {
                saveBtn
                    .addClass('smm-success')
                    .text('Updated');
                completed++;
                if (completed >= total - 1) {
                    btn
                        .addClass('smm-success')
                        .text('All Updated');
                    $('body').append(`
                    <div class="smm-toast">
                        All Media Updated Successfully
                    </div>
                `);
                    setTimeout(function () {
                        btn
                            .removeClass('smm-success')
                            .text('Update All Media');
                        $('.save-alt')
                            .removeClass('smm-success')
                            .text('Save');
                    }, 2000);
                    setTimeout(function () {
                        $('.smm-toast').fadeOut(300, function () {
                            $(this).remove();
                        });
                    }, 2000);
                }
            });
        });
    });
});
