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
<option value="">All Content (${res.total})</option>
<option value="blank_title">Blank Meta Title (${res.blank_title})</option>
<option value="blank_desc">Blank Meta Description (${res.blank_desc})</option>
<option value="both_blank">Both Blank (${res.both_blank})</option>
<option value="both_filled">Both Filled (${res.both_filled})</option>
`);

        });
    }

    /* =========================================
       LOAD CONTENT
    ========================================= */
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

            let perPage = parseInt($('#smm-content-per-page').val());

            let startIndex = (contentPage - 1) * perPage;

            if (!res.data.length) {

                html = `
<tr>
<td colspan="8">No content found</td>
</tr>
`;

            } else {

                res.data.forEach((item, i) => {

                    let index = startIndex + i + 1;

                    html += `
<tr>

<td>${index}</td>

<td>
<input
type="text"
class="smm-post-title"
data-id="${item.id}"
value="${item.title || ''}"
>
</td>

<td>
<input
type="text"
class="smm-post-slug"
data-id="${item.id}"
value="${item.slug || ''}"
>
</td>

<td>
<input
type="text"
class="smm-meta-title"
data-id="${item.id}"
value="${item.meta_title || ''}"
>

<div class="smm-counter smm-title-count">
0 / 60
</div>
</td>

<td>
<textarea
class="smm-meta-desc"
data-id="${item.id}"
>${item.meta_desc || ''}</textarea>

<div class="smm-counter smm-desc-count">
0 / 160
</div>
</td>

<td>

<label class="smm-switch">
<input
type="checkbox"
class="smm-noindex"
data-id="${item.id}"
${item.noindex === '1' ? 'checked' : ''}
>
</label>

<label class="smm-switch">
<input
type="checkbox"
class="smm-nofollow"
data-id="${item.id}"
${item.nofollow === '1' ? 'checked' : ''}
>
</label>

</td>

<td style="display:grid;gap:8px;">

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

            renderPagination(res.pages, res.current);

        });
    }

    /* =========================================
       PAGINATION
    ========================================= */
    function renderPagination(totalPages, currentPage) {

        let html = `<div class="smm-pagination">`;

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

        for (let i = 1; i <= totalPages; i++) {

            let active = i == currentPage ? 'active' : '';

            html += `
<button
class="smm-content-page ${active}"
data-page="${i}"
>
${i}
</button>
`;
        }

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

        let btn = $(this);

        let id = btn.data('id');

        let row = btn.closest('tr');

        let title = $(`.smm-post-title[data-id="${id}"]`).val().trim();

        let slug = $(`.smm-post-slug[data-id="${id}"]`).val().trim();

        let meta_title = $(`.smm-meta-title[data-id="${id}"]`).val();

        let meta_desc = $(`.smm-meta-desc[data-id="${id}"]`).val();

        let noindex = $(`.smm-noindex[data-id="${id}"]`).is(':checked') ? '1' : '0';

        let nofollow = $(`.smm-nofollow[data-id="${id}"]`).is(':checked') ? '1' : '0';

        /* TITLE REQUIRED */
        if (title === '') {

            $('body').append(`
<div class="smm-toast">
Page Title Required
</div>
`);

            setTimeout(function () {

                $('.smm-toast').fadeOut(300, function () {

                    $(this).remove();

                });

            }, 2000);

            return;
        }

        /* AUTO SLUG */
        if (slug === '') {

            slug = title
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');

            $(`.smm-post-slug[data-id="${id}"]`).val(slug);
        }

        btn.text('Updating...');

        $.post(smm_ajax.ajaxurl, {
            action: 'smm_update_full_content',
            id: id,
            title: title,
            slug: slug,
            meta_title: meta_title,
            meta_desc: meta_desc,
            noindex: noindex,
            nofollow: nofollow
        }, function (res) {

            if (res.success) {

                /* UPDATE VIEW LINK */
                if (res.data && res.data.link) {

                    row.find('.smm-view-link')
                        .attr('href', res.data.link);
                }

                btn
                    .addClass('smm-success')
                    .text('Updated');

                $('body').append(`
<div class="smm-toast">
Content Updated Successfully
</div>
`);

                setTimeout(function () {

                    btn
                        .removeClass('smm-success')
                        .text('Update');

                }, 2000);

                setTimeout(function () {

                    $('.smm-toast').fadeOut(300, function () {

                        $(this).remove();

                    });

                }, 2000);
            }
        });
    });

    /* =========================================
       CLEAR INPUTS
    ========================================= */
    $(document).on('click', '.smm-clear-meta', function () {

        let id = $(this).data('id');

        $(`.smm-post-title[data-id="${id}"]`).val('');

        $(`.smm-post-slug[data-id="${id}"]`).val('');

        $(`.smm-meta-title[data-id="${id}"]`).val('');

        $(`.smm-meta-desc[data-id="${id}"]`).val('');

        $(`.smm-noindex[data-id="${id}"]`).prop('checked', false);

        $(`.smm-nofollow[data-id="${id}"]`).prop('checked', false);

    });

    /* =========================================
       AUTO LOAD
    ========================================= */
    if ($('#smm-content-table').length) {

        updateMetaFilterCounts();

        loadContent();

    }

    /* =========================================
       UPDATE ALL
    ========================================= */
    $(document).on('click', '#smm-update-all', function () {

        let btn = $(this);

        btn.text('Updating...');

        let rows = $('#smm-content-table tr');

        let total = rows.length;

        let completed = 0;

        rows.each(function () {

            let row = $(this);

            let id = row.find('.smm-save-meta').data('id');

            if (!id) {
                return;
            }

            let title = row.find('.smm-post-title').val().trim();

            let slug = row.find('.smm-post-slug').val().trim();

            let meta_title = row.find('.smm-meta-title').val();

            let meta_desc = row.find('.smm-meta-desc').val();

            let noindex = row.find('.smm-noindex').is(':checked') ? '1' : '0';

            let nofollow = row.find('.smm-nofollow').is(':checked') ? '1' : '0';

            /* AUTO SLUG */
            if (slug === '') {

                slug = title
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-');

                row.find('.smm-post-slug').val(slug);
            }

            $.post(smm_ajax.ajaxurl, {
                action: 'smm_update_full_content',
                id: id,
                title: title,
                slug: slug,
                meta_title: meta_title,
                meta_desc: meta_desc,
                noindex: noindex,
                nofollow: nofollow
            }, function (res) {

                if (res.success) {

                    /* UPDATE LINK */
                    if (res.data && res.data.link) {

                        row.find('.smm-view-link')
                            .attr('href', res.data.link);
                    }

                    row.find('.smm-save-meta')
                        .addClass('smm-success')
                        .text('Updated');

                    completed++;

                    if (completed >= total - 1) {

                        btn
                            .addClass('smm-success')
                            .text('All Updated');

                        $('body').append(`
<div class="smm-toast">
All Content Updated Successfully
</div>
`);

                        setTimeout(function () {

                            btn
                                .removeClass('smm-success')
                                .text('Update All');

                            $('.smm-save-meta')
                                .removeClass('smm-success')
                                .text('Update');

                        }, 2000);

                        setTimeout(function () {

                            $('.smm-toast').fadeOut(300, function () {

                                $(this).remove();

                            });

                        }, 2000);
                    }
                }
            });
        });
    });
});