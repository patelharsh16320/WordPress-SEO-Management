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
                            <td>${img.title}</td>
                            <td>
                                <input 
                                    type="text"
                                    class="alt-input"
                                    data-id="${img.id}"
                                    value="${img.alt || ''}"
                                >
                            </td>
                            <td>
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
        $.post(smm_ajax.ajaxurl, {
            action: 'smm_update_alt',
            id: id,
            alt: alt
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
});
