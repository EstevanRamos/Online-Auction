<script>
  import "../styles.css";
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
            
            <div class="auth-buttons">
                <a href="/login" class="btn btn-outline">Login</a>
                <a href="/register" class="btn btn-primary">Register</a>
            </div>
        </div>
    </nav>
<slot />