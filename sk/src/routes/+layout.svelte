<script>
  import "../styles.css";
  let {children, data} = $props()
  console.log(data.user)
  
  // Mobile menu state
  let isMobileMenuOpen = false;

  function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
  }

  function closeMobileMenu() {
    isMobileMenuOpen = false;
  }

  async function handleLogout() {
    try {
      const response = await fetch('/logout', {
        method: 'POST'
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
</script>

<!-- Navigation Bar -->
<nav class="navbar">
    <div class="container nav-container">
        <a href="#" class="logo" onclick={closeMobileMenu}>
            <i class="ri-auction-line"></i>
            <span class="logo-text">DailyAuction</span>
        </a>
        
        <!-- Mobile menu toggle -->
        <button class="mobile-menu-toggle" onclick={toggleMobileMenu} aria-label="Toggle mobile menu">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        </button>
        
        <!-- Desktop navigation -->
        <ul class="nav-links desktop-nav">
            <li><a href="/" onclick={closeMobileMenu}>Home</a></li>
            <li><a href="/" onclick={closeMobileMenu}>Auctions</a></li>
            <li><a href="/" onclick={closeMobileMenu}>How It Works</a></li>
            <li><a href="/" onclick={closeMobileMenu}>About Us</a></li>
            <li><a href="/" onclick={closeMobileMenu}>Contact</a></li>
        </ul>
        
        <!-- Desktop auth buttons -->
        <div class="auth-buttons desktop-auth">
            {#if data.user === undefined}
                <a href="/login" class="btn btn-outline">Login</a>
                <a href="/register" class="btn btn-primary">Register</a>
            {:else}
                <button type="button" class="btn btn-outline" onclick={handleLogout}>Logout</button>
            {/if}
        </div>
        
        <!-- Mobile navigation overlay -->
        <div class="mobile-nav-overlay" class:active={isMobileMenuOpen} onclick={closeMobileMenu}></div>
        
        <!-- Mobile navigation menu -->
        <div class="mobile-nav-menu" class:active={isMobileMenuOpen}>
            <ul class="mobile-nav-links">
                <li><a href="/" onclick={closeMobileMenu}>Home</a></li>
                <li><a href="/" onclick={closeMobileMenu}>Auctions</a></li>
                <li><a href="/" onclick={closeMobileMenu}>How It Works</a></li>
                <li><a href="/" onclick={closeMobileMenu}>About Us</a></li>
                <li><a href="/" onclick={closeMobileMenu}>Contact</a></li>
            </ul>
            
            <div class="mobile-auth-buttons">
                {#if false}
                    <a href="/login" class="btn btn-outline" onclick={closeMobileMenu}>Login</a>
                    <a href="/register" class="btn btn-primary" onclick={closeMobileMenu}>Register</a>
                {:else}
                    <button type="button" class="btn btn-outline" onclick={() => { handleLogout(); closeMobileMenu(); }}>Logout</button>
                {/if}
            </div>
        </div>
    </div>
</nav>

{@render children()}