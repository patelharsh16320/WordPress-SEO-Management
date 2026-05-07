<?php
if (!defined('ABSPATH')) exit;
/* =========================================
   REGISTER TAXONOMIES
========================================= */
add_action('init', function () {
    /* =========================================
       MEDIA GROUPS
    ========================================= */
    register_taxonomy('smm_image_group', 'attachment', [
        'label' => 'Image Groups',
        'hierarchical' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_rest' => true
    ]);
    /* =========================================
       CONTENT GROUPS
    ========================================= */
    register_taxonomy('smm_content_group', ['post', 'page'], [
        'label' => 'Content Groups',
        'hierarchical' => true,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_rest' => true
    ]);
    /* =========================================
       SEO STATUS
    ========================================= */
    register_taxonomy('smm_seo_status', ['post', 'page'], [
        'label' => 'SEO Status',
        'hierarchical' => false,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_rest' => true
    ]);
    /* =========================================
       DUPLICATE META
    ========================================= */
    register_taxonomy('smm_duplicate_meta', ['post', 'page'], [
        'label' => 'Duplicate Meta',
        'hierarchical' => false,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_rest' => true
    ]);
    /* =========================================
       IMAGE OPTIMIZATION
    ========================================= */
    register_taxonomy('smm_image_status', 'attachment', [
        'label' => 'Image Optimization',
        'hierarchical' => false,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_rest' => true
    ]);
    /* =========================================
       CONTENT HEALTH
    ========================================= */
    register_taxonomy('smm_content_health', ['post', 'page'], [
        'label' => 'Content Health',
        'hierarchical' => false,
        'show_ui' => true,
        'show_admin_column' => true,
        'show_in_rest' => true
    ]);
});
