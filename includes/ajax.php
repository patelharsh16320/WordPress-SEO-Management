<?php
if (!defined('ABSPATH')) exit;
/* =========================================
   LOAD IMAGES
========================================= */
add_action('wp_ajax_smm_fetch_images', function () {
    $page = intval($_POST['page'] ?? 1);
    $per_page = intval($_POST['per_page'] ?? 10);
    $search = sanitize_text_field($_POST['search'] ?? '');
    $only_blank = $_POST['blank'] ?? '';
    $only_not_blank = $_POST['not_blank'] ?? '';
    $args = [
        'post_type'      => 'attachment',
        'post_status'    => 'inherit',
        'posts_per_page' => $per_page,
        'paged'          => $page,
    ];
    if ($search) {
        $args['s'] = $search;
    }
    $query = new WP_Query($args);
    $data = [];
    foreach ($query->posts as $img) {
        $alt = get_post_meta(
            $img->ID,
            '_wp_attachment_image_alt',
            true
        );
        /* BLANK ALT */
        if (
            $only_blank === '1'
            && !empty($alt)
        ) {
            continue;
        }
        /* WITH ALT */
        if (
            $only_not_blank === '1'
            && empty($alt)
        ) {
            continue;
        }
        $data[] = [
            'id'    => $img->ID,
            'title' => $img->post_title,
            'url'   => wp_get_attachment_url($img->ID),
            'alt'   => $alt
        ];
    }
    wp_send_json([
        'data'    => $data,
        'total'   => $query->found_posts,
        'pages'   => $query->max_num_pages,
        'current' => $page
    ]);
});
/* =========================================
   UPDATE IMAGE ALT + TITLE
========================================= */
add_action('wp_ajax_smm_update_alt', function () {
    $id = intval($_POST['id']);
    $alt = sanitize_text_field($_POST['alt']);
    $title = sanitize_text_field($_POST['title']);
    /* UPDATE ALT */
    update_post_meta(
        $id,
        '_wp_attachment_image_alt',
        $alt
    );
    /* UPDATE TITLE */
    wp_update_post([
        'ID' => $id,
        'post_title' => $title
    ]);
    wp_send_json_success();
});
/* =========================================
   CLEAR ALT
========================================= */
add_action('wp_ajax_smm_clear_alt', function () {
    wp_send_json([
        'success' => true,
        'message' => 'Frontend only clear'
    ]);
});
/* =========================================
   FETCH CONTENT
========================================= */
add_action('wp_ajax_smm_fetch_content', function () {
    $page = intval($_POST['page'] ?? 1);
    $per_page = intval($_POST['per_page'] ?? 10);
    $type = sanitize_text_field($_POST['type'] ?? 'post');
    $search = sanitize_text_field($_POST['search'] ?? '');
    $meta_filter = sanitize_text_field(
        $_POST['meta_filter'] ?? ''
    );
    $args = [
        'post_type'      => $type,
        'post_status'    => 'publish',
        'posts_per_page' => $per_page,
        'paged'          => $page,
        's'              => $search
    ];
    $query = new WP_Query($args);
    $data = [];
    foreach ($query->posts as $post) {
        $meta_title = get_post_meta(
            $post->ID,
            '_yoast_wpseo_title',
            true
        );
        $meta_desc = get_post_meta(
            $post->ID,
            '_yoast_wpseo_metadesc',
            true
        );
        /* =========================================
           FILTERS
        ========================================= */
        /* BLANK TITLE */
        if (
            $meta_filter === 'blank_title'
            && !empty($meta_title)
        ) {
            continue;
        }
        /* BLANK DESC */
        if (
            $meta_filter === 'blank_desc'
            && !empty($meta_desc)
        ) {
            continue;
        }
        /* BOTH BLANK */
        if (
            $meta_filter === 'both_blank'
            && (
                !empty($meta_title)
                || !empty($meta_desc)
            )
        ) {
            continue;
        }
        /* BOTH FILLED */
        if (
            $meta_filter === 'both_filled'
            && (
                empty($meta_title)
                || empty($meta_desc)
            )
        ) {
            continue;
        }
        $data[] = [
            'id' => $post->ID,
            'title' => $post->post_title,
            'slug' => $post->post_name,
            'meta_title' => $meta_title,
            'meta_desc' => $meta_desc,
            'link' => get_permalink($post->ID),
            /* NOINDEX */
            'noindex' => get_post_meta(
                $post->ID,
                '_yoast_wpseo_meta-robots-noindex',
                true
            ),
            /* NOFOLLOW */
            'nofollow' => get_post_meta(
                $post->ID,
                '_yoast_wpseo_meta-robots-nofollow',
                true
            ),
        ];
    }
    wp_send_json([
        'data' => $data,
        'pages' => $query->max_num_pages,
        'current' => $page
    ]);
});
/* =========================================
   UPDATE CONTENT
========================================= */
add_action('wp_ajax_smm_update_full_content', function () {
    $id = intval($_POST['id']);
    $title = sanitize_text_field(
        $_POST['title']
    );
    $slug = sanitize_title(
        $_POST['slug']
    );
    $meta_title = sanitize_text_field(
        $_POST['meta_title']
    );
    $meta_desc = sanitize_textarea_field(
        $_POST['meta_desc']
    );
    $noindex = sanitize_text_field(
        $_POST['noindex'] ?? '0'
    );
    $nofollow = sanitize_text_field(
        $_POST['nofollow'] ?? '0'
    );
    /* UPDATE POST */
    wp_update_post([
        'ID' => $id,
        'post_title' => $title,
        'post_name' => $slug
    ]);
    /* UPDATE YOAST META */
    update_post_meta(
        $id,
        '_yoast_wpseo_title',
        $meta_title
    );
    update_post_meta(
        $id,
        '_yoast_wpseo_metadesc',
        $meta_desc
    );
    /* UPDATE NOINDEX */
    update_post_meta(
        $id,
        '_yoast_wpseo_meta-robots-noindex',
        $noindex
    );
    /* UPDATE NOFOLLOW */
    update_post_meta(
        $id,
        '_yoast_wpseo_meta-robots-nofollow',
        $nofollow
    );
    wp_send_json_success();
});
/* =========================================
   CLEAR CONTENT META
========================================= */
add_action('wp_ajax_smm_clear_content_meta', function () {
    $id = intval($_POST['id']);
    delete_post_meta(
        $id,
        '_yoast_wpseo_title'
    );
    delete_post_meta(
        $id,
        '_yoast_wpseo_metadesc'
    );
    delete_post_meta(
        $id,
        '_yoast_wpseo_meta-robots-noindex'
    );
    delete_post_meta(
        $id,
        '_yoast_wpseo_meta-robots-nofollow'
    );
    wp_send_json_success();
});
/* =========================================
   META FILTER COUNTS
========================================= */
add_action('wp_ajax_smm_get_meta_counts', function () {
    $type = sanitize_text_field(
        $_POST['type']
    );
    $posts = get_posts([
        'post_type'      => $type,
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'fields'         => 'ids'
    ]);
    $blank_title = 0;
    $blank_desc = 0;
    $both_blank = 0;
    $both_filled = 0;
    foreach ($posts as $post_id) {
        $meta_title = get_post_meta(
            $post_id,
            '_yoast_wpseo_title',
            true
        );
        $meta_desc = get_post_meta(
            $post_id,
            '_yoast_wpseo_metadesc',
            true
        );
        /* BLANK TITLE */
        if (empty($meta_title)) {
            $blank_title++;
        }
        /* BLANK DESC */
        if (empty($meta_desc)) {
            $blank_desc++;
        }
        /* BOTH BLANK */
        if (
            empty($meta_title)
            && empty($meta_desc)
        ) {
            $both_blank++;
        }
        /* BOTH FILLED */
        if (
            !empty($meta_title)
            && !empty($meta_desc)
        ) {
            $both_filled++;
        }
    }
    wp_send_json([
        'total' => count($posts),
        'blank_title' => $blank_title,
        'blank_desc' => $blank_desc,
        'both_blank' => $both_blank,
        'both_filled' => $both_filled
    ]);
});
