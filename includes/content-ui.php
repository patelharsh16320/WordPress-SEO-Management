<?php
if (!defined('ABSPATH')) exit;
/* =========================
   CONTENT MANAGER MENU
========================= */
add_action('admin_menu', function () {
    add_submenu_page(
        'smm-media',
        'Content Manager',
        'Content Manager',
        'manage_options',
        'smm-content',
        'smm_content_page'
    );
});
/* =========================
   PAGE UI
========================= */
function smm_content_page()
{
?>
    <div class="smm-wrap">
        <h1>Content Manager</h1>
        <!-- CONTROLS -->
        <div class="smm-controls">
            <!-- TYPE -->
            <?php
            $post_count = wp_count_posts('post')->publish;

            $page_count = wp_count_posts('page')->publish;
            ?>

            <select id="smm-content-type">
                <option value="page" selected>
                    Pages (<?php echo $page_count; ?>)
                </option>
                <option value="post">
                    Posts (<?php echo $post_count; ?>)
                </option>
            </select>
            <!-- SEARCH -->
            <input
                type="text"
                id="smm-content-search"
                placeholder="Search title...">
            <!-- PER PAGE -->
            <select id="smm-content-per-page">
                <option value="10">10 / page</option>
                <option value="20">20 / page</option>
                <option value="50">50 / page</option>
            </select>
            <!-- META FILTER -->
<select id="smm-meta-filter">

    <option value="">
        All Content
    </option>

    <option value="blank_title">
        Blank Meta Title
    </option>

    <option value="blank_desc">
        Blank Meta Description
    </option>

    <option value="both_blank">
        Both Blank
    </option>

    <option value="both_filled">
        Both Filled
    </option>

</select>
        </div>

        <!-- TABLE -->
        <table class="smm-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Meta Title</th>
                    <th>Meta Description</th>
                    <th>Actions</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody id="smm-content-table">
                <tr>
                    <td colspan="5">Loading...</td>
                </tr>
            </tbody>
        </table>
        <!-- PAGINATION -->
        <div id="smm-content-pagination"></div>
    </div>
<?php
}
