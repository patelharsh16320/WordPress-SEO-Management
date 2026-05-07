<?php
if (!defined('ABSPATH')) exit;/* =========================================
ADMIN MENU
========================================= */
add_action('admin_menu', function () {    /* MAIN MENU */
    add_menu_page(
        'Smart Meta Manager',
        'Smart Meta Manager',
        'manage_options',
        'smm-media',
        'smm_media_page',
        'dashicons-chart-area',
        6
    );    /* MEDIA MANAGER */
    add_submenu_page(
        'smm-media',
        'Media Manager',
        'Media Manager',
        'manage_options',
        'smm-media',
        'smm_media_page'
    );
});/* =========================================
MEDIA PAGE
========================================= */
function smm_media_page()
{
?><div class="smm-wrap">
        <h1>Media Manager</h1> <!-- CONTROLS -->
        <div class="smm-controls"> <!-- SEARCH -->
            <input
                type="text"
                id="smm-search"
                placeholder="Search by image Title">
            <select id="smm-per-page">
                <option value="10">
                    10 / page
                </option>
                <option value="20">
                    20 / page
                </option>
                <option value="50">
                    50 / page
                </option>
                <option value="100">
                    100 / page
                </option>
            </select> <!-- ALT FILTER -->
            <select id="smm-filter-alt">
                <option value="">
                    All Images
                </option>
                <option value="blank">
                    Blank ALT Only
                </option>
                <option value="not-blank">
                    With ALT Only
                </option>
            </select>
        </div> <!-- TABLE -->
        <table class="smm-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>ALT Text</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="smm-results">
                <!-- AJAX -->
            </tbody>
        </table>
        <div class="smm-bottom-actions">
            <button id="smm-update-all-media">
                Update All Media
            </button>
        </div>
        <div id="smm-pagination"></div>
    </div><?php
}
