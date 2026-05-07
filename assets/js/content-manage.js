jQuery(function ($) {
    let contentPage = 1;
    /* =========================================
    UPDATE FILTER COUNTS
    ========================================= */
    function updateMetaFilterCounts() {
        $.post(smm_ajax.ajaxurl, {
            action: 'smm_get_meta_counts',
            type: $('#smm-content-type').val()
        }, function (res) {
            $('#smm-meta-filter').html(`
<option value="">
All Content (${res.total})
</option>
<option value="blank_title">
Blank Meta Title (${res.blank_title})
</option>
<option value="blank_desc">
Blank Meta Description (${res.blank_desc})
</option>
<option value="both_blank">
Both Blank (${res.both_blank})
</option>
<option value="both_filled">
Both Filled (${res.both_filled})
</option>
`);
        });
    }
    function loadContent() {
        $.post(smm_ajax.ajaxurl, {
            action: 'smm_fetch_content',
            page: contentPage,
            per_page: $('#smm-content-per-page').val(),
            type: $('#smm-content-type').val(),
            search: $('#smm-content-search').val(),
            meta_filter: $('#smm-meta-filter').val()
        }, function (res) {
            let html = '';
            let perPage = parseInt(
                $('#smm-content-per-page').val()
            );
            let startIndex = (contentPage - 1) * perPage;
            /* NO DATA */
            if (!res.data.length) {
                html = `
<tr>
<td colspan="8">
No content found
</td>
</tr>
`;
            } else {
                /* LOOP */
                res.data.forEach((item, i) => {
                    let index = startIndex + i + 1;
                    html += `
<tr>
<!-- INDEX -->
<td>${index}</td>
<!-- TITLE -->
<td>
<input
type="text"
class="smm-post-title"
data-id="${item.id}"
value="${item.title || ''}"
>
</td>
<!-- SLUG -->
<td>
<input
type="text"
class="smm-post-slug"
data-id="${item.id}"
value="${item.slug || ''}"
>
</td>
<!-- META TITLE -->
<td>
<input
type="text"
class="smm-meta-title"
data-id="${item.id}"
value="${item.meta_title || ''}"
>
</td>
<!-- META DESC -->
<td>
<textarea
class="smm-meta-desc"
data-id="${item.id}"
>${item.meta_desc || ''}</textarea>
</td>
<!-- ACTIONS -->
<td>
<button
class="smm-save-meta"
data-id="${item.id}"
>
Update
</button>
<button
class="smm-clear-meta"
data-id="${item.id}"
>
Clear
</button>
</td>
<!-- LINK -->
<td>
<a
href="${item.link}"
target="_blank"
class="smm-view-link"
>
View
</a>
</td>
</tr>
`;
                });
            }
            $('#smm-content-table').html(html);
            renderPagination(
                res.pages,
                res.current
            );
        });
    }
    /* =========================================
    PAGINATION
    ========================================= */
    function renderPagination(totalPages, currentPage) {
        let html = `<div class="smm-pagination">`;
        /* PREV */
        if (currentPage > 1) {
            html += `
<button
class="smm-content-page"
data-page="${currentPage - 1}"
>
Prev
</button>
`;
        }
        /* PAGE NUMBERS */
        for (let i = 1; i <= totalPages; i++) {
            let active = i == currentPage
                ? 'active'
                : '';
            html += `
<button
class="smm-content-page ${active}"
data-page="${i}"
>
${i}
</button>
`;
        }
        /* NEXT */
        if (currentPage < totalPages) {
            html += `
<button
class="smm-content-page"
data-page="${currentPage + 1}"
>
Next
</button>
`;
        }
        html += `</div>`;
        $('#smm-content-pagination').html(html);
    }
    /* =========================================
    PAGE CLICK
    ========================================= */
    $(document).on('click', '.smm-content-page', function () {
        contentPage = $(this).data('page');
        loadContent();
    });
    /* =========================================
    FILTERS
    ========================================= */
    $('#smm-content-type, #smm-content-search, #smm-content-per-page, #smm-meta-filter')
        .on('keyup change', function () {
            contentPage = 1;
            updateMetaFilterCounts();
            loadContent();
        });
    /* =========================================
    UPDATE CONTENT
    ========================================= */
    $(document).on('click', '.smm-save-meta', function () {
        let id = $(this).data('id');
        let title = $(`.smm-post-title[data-id="${id}"]`).val();
        let slug = $(`.smm-post-slug[data-id="${id}"]`).val();
        let meta_title = $(`.smm-meta-title[data-id="${id}"]`).val();
        let meta_desc = $(`.smm-meta-desc[data-id="${id}"]`).val();
        $.post(smm_ajax.ajaxurl, {
            action: 'smm_update_full_content',
            id: id,
            title: title,
            slug: slug,
            meta_title: meta_title,
            meta_desc: meta_desc
        }, function () {
            /* SUCCESS MESSAGE */
            $('body').append(`
<div class="smm-toast">
Content Updated Successfully
</div>
`);
            /* REMOVE AFTER 2 SEC */
            setTimeout(function () {
                $('.smm-toast').fadeOut(300, function () {
                    $(this).remove();
                });
            }, 2000);
            loadContent();
        });
    });
    /* =========================================
    CLEAR INPUTS ONLY
    ========================================= */
    $(document).on('click', '.smm-clear-meta', function () {
        let id = $(this).data('id');
        $(`.smm-post-title[data-id="${id}"]`).val('');
        $(`.smm-post-slug[data-id="${id}"]`).val('');
        $(`.smm-meta-title[data-id="${id}"]`).val('');
        $(`.smm-meta-desc[data-id="${id}"]`).val('');
    });
    /* =========================================
    AUTO LOAD
    ========================================= */
    if ($('#smm-content-table').length) {
        updateMetaFilterCounts();
        loadContent();
    }
});