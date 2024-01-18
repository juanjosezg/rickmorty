<?php
/*
Plugin Name: Rick And Morty Search
Plugin Uri: https://www.jzg.mx
Description: Search for Rick and Morty Characters
Author: Juan José Zermeño Godinez
Version: 1.0
Author URI: https://www.jzg.mx
*/


function generate_unique_widget_id() {
  return 'rickmorty_widget_' . uniqid();
}

function enqueue_rickmorty_scripts() {
  wp_enqueue_style( 'rickmorty-css', plugin_dir_url( __FILE__ ) . 'dist/css/style.css');
  wp_enqueue_script('rickmorty-js', plugin_dir_url( __FILE__ ) . 'dist/js/main.js', array(), '1.0', true);
}


function rickandmorty_shortcode_fn($atts) {
  $widget_id = generate_unique_widget_id();
  $attributes = shortcode_atts(
    array(
      'status' => '',
      'gender' => '',
      'name'=> '',
    ),
    $atts
  );
  ob_start(); 
  ?>
  

  <div id="<?php echo esc_attr($widget_id); ?>" class="rickmorty-widget">
  <div class="rickmorty-wrapper">
    <div class="rickmorty-head" style="background-image: url('<?php echo plugin_dir_url( __FILE__ ) ?>/dist/img/bg-rickmorty.png');">
      <img class="rickmorty-logo" src="<?php echo plugin_dir_url( __FILE__ ) ?>dist/img/logo.svg" >
    </div>
    
    <form role="search" method="get" class="form rickmorty-form" action="">
      <div class="rickmorty-form__search">
        <label>
          <span class="screen-reader-text">Nombre del Personaje</span>
          <input type="search"
       
           class="search-field"
           placeholder="Nombre del Personaje.." 
           value="<?php echo $attributes['name'] ?>" 
           title="" 
           />
        </label>
        <input type="button" class="search-submit button" value="Buscar" />
      </div>
      
      <div class="rickmorty-filters">

        <select name="status" class="status-filter">
          <option value="">Filtrar por Estado</option>
          <option value="alive" <?php echo ($attributes['status'] == 'alive') ? 'selected' : ''; ?>>Vivo</option>
          <option value="dead" <?php echo ($attributes['status'] == 'dead') ? 'selected' : ''; ?>>Muerto</option>
          <option value="unknown" <?php echo ($attributes['status'] == 'unknown') ? 'selected' : ''; ?>>Desconocido</option>
          <option value="" <?php echo empty($attributes['status']) ? 'selected' : ''; ?>>Todos</option>
        </select>

        <select name="gender" class="gender-filter">
            <option value="">Filtrar por Género</option>
            <option value="female" <?php echo ($attributes['gender'] == 'female') ? 'selected' : ''; ?>>Mujer</option>
            <option value="male" <?php echo ($attributes['gender'] == 'male') ? 'selected' : ''; ?>>Hombre</option>
            <option value="genderless" <?php echo ($attributes['gender'] == 'genderless') ? 'selected' : ''; ?>>Sin Género</option>
            <option value="unknown" <?php echo ($attributes['gender'] == 'unknown') ? 'selected' : ''; ?>>Desconocido</option>
            <option value="" <?php echo empty($attributes['gender']) ? 'selected' : ''; ?>>Todos</option>
        </select>

      </div>

    </form>
 
    
    <div class="pagination-controls">
      <p class="total-results">Resultados Totales: 0</p>
      <button class="prev-button"  disabled>Anterior</button>
      <span class="current-page">Pagina 1</span>
      <button class="next-button"  disabled>Siguiente</button>
    </div>
    
    <div class="rickmorty-characters">
      <div class="loading" class="loading" style="display: none;">
        <img src="<?php echo plugin_dir_url( __FILE__ ) ?>dist/img/loading.gif" alt="Loading..." class="loadingGif"/>
      </div>
      <div class="rickmorty-characters-content"></div>
  

    </div>
    
  </div>

  </div>
  <?php
  $output = ob_get_clean(); 
  return $output;
}

// Agregar el shortcode
add_action('wp_enqueue_scripts', 'enqueue_rickmorty_scripts');
add_shortcode('rickandmorty', 'rickandmorty_shortcode_fn');
?>