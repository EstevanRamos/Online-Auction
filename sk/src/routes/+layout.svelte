<script>
  import "../styles.css";
  let {children, data} = $props()
  console.log(data.user)

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
            <a href="#" class="logo">
                <i class="ri-auction-line"></i>
                DailyAuction
            </a>
            
            <ul class="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/">Auctions</a></li>
                <li><a href="/">How It Works</a></li>
                <li><a href="/">About Us</a></li>
                <li><a href="/">Contact</a></li>
            </ul>
            
            {#if false}
                <div class="auth-buttons">
                    <a href="/login" class="btn btn-outline">Login</a>
                    <a href="/register" class="btn btn-primary">Register</a>
                </div>
            {:else}
                <div class="auth-buttons">
                    <button type="button" class="btn btn-outline" onclick={handleLogout}>Logout</button>
                </div>
            {/if}
        </div>
    </nav>

{@render children()}