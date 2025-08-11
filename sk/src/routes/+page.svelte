<div class="container">
    <!-- Hero Section -->
    <section class="hero">
        <div class="container hero-content">
            <h1>Discover Unique Treasures Every Day</h1>
            <p>New auctions daily at 10 AM</p>
            <a href="/auction" class="btn btn-primary btn-large">Enter Today's Auction</a>
        </div>
    </section>
    
    <!-- Featured Items -->
    <section class="featured">
        <div class="container">
            <div class="section-header">
                <h2>Featured Items</h2>
            </div>
            
            <div class="items-grid">
                <!-- Item 1 -->
                <div class="auction-card">
                    <div class="card-image">
                        <i class="ri-image-line"></i>
                        <div class="watchlist-btn">
                            <i class="ri-heart-line"></i>
                        </div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">Vintage Leather Armchair</h3>
                        <p>Beautifully preserved mid-century design</p>
                        <div class="card-info">
                            <div class="bid-info">
                                <span class="label">Current Bid</span>
                                <span class="value bid-value">$245.00</span>
                            </div>
                            <div class="time-info">
                                <span class="label">Time Left</span>
                                <span class="value time-value">3h 45m</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Item 2 -->
                <div class="auction-card">
                    <div class="card-image">
                        <i class="ri-image-line"></i>
                        <div class="watchlist-btn">
                            <i class="ri-heart-line"></i>
                        </div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">Handcrafted Ceramic Vase</h3>
                        <p>Artisan-made with natural clay and glazes</p>
                        <div class="card-info">
                            <div class="bid-info">
                                <span class="label">Current Bid</span>
                                <span class="value bid-value">$78.50</span>
                            </div>
                            <div class="time-info">
                                <span class="label">Time Left</span>
                                <span class="value time-value">5h 12m</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Item 3 -->
                <div class="auction-card">
                    <div class="card-image">
                        <i class="ri-image-line"></i>
                        <div class="watchlist-btn">
                            <i class="ri-heart-line"></i>
                        </div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">Antique Brass Telescope</h3>
                        <p>19th century nautical collectible</p>
                        <div class="card-info">
                            <div class="bid-info">
                                <span class="label">Current Bid</span>
                                <span class="value bid-value">$320.00</span>
                            </div>
                            <div class="time-info">
                                <span class="label">Time Left</span>
                                <span class="value time-value">1h 30m</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Item 4 -->
                <div class="auction-card">
                    <div class="card-image">
                        <i class="ri-image-line"></i>
                        <div class="watchlist-btn">
                            <i class="ri-heart-line"></i>
                        </div>
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">Handwoven Moroccan Rug</h3>
                        <p>Authentic wool with traditional patterns</p>
                        <div class="card-info">
                            <div class="bid-info">
                                <span class="label">Current Bid</span>
                                <span class="value bid-value">$195.75</span>
                            </div>
                            <div class="time-info">
                                <span class="label">Time Left</span>
                                <span class="value time-value">4h 20m</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
    <!-- Footer -->
    <footer class="footer">
        <div class="container footer-container">
            <a href="#" class="footer-logo">
                <i class="ri-auction-line"></i>
                DailyAuction
            </a>
            
            <ul class="footer-links">
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Privacy</a></li>
            </ul>
            
            <div class="copyright">
                © 2023 DailyAuction. All rights reserved.
            </div>
        </div>
    </footer>
</div>

    <style>
       /* Hero Section */
        .hero {
            background: linear-gradient(135deg, var(--light-sand), #f8f1e8);
            padding: var(--spacing-xxl) 0;
            position: relative;
            overflow: hidden;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 70% 30%, var(--golden-orange), transparent 40%);
            opacity: 0.1;
        }
        
        .hero-content {
            max-width: 800px;
            margin: 0 auto;
            text-align: center;
            position: relative;
            z-index: 1;
            padding: var(--spacing-xxl) 0;
        }
        
        .hero h1 {
            font-size: 48px;
            margin-bottom: var(--spacing-md);
            color: var(--dark-brown);
        }
        
        .hero p {
            font-size: 20px;
            margin-bottom: var(--spacing-xl);
            color: var(--earthy-brown);
        }
        
        /* Featured Items */
        .featured {
            padding: var(--spacing-xxl) 0;
            background-color: var(--white);
        }
        
        .section-header {
            text-align: center;
            margin-bottom: var(--spacing-xl);
        }
        
        .section-header h2 {
            font-size: 36px;
            color: var(--earthy-brown);
            position: relative;
            display: inline-block;
            padding-bottom: var(--spacing-md);
        }
        
        .section-header h2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 3px;
            background-color: var(--golden-orange);
        }
        
        .items-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: var(--spacing-xl);
        }
        
        .auction-card {
            background-color: var(--white);
            border-radius: var(--radius-lg);
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .auction-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        }
        
        .card-image {
            height: 200px;
            background-color: var(--light-sand);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }
        
        .card-image i {
            font-size: 64px;
            color: var(--earthy-brown);
            opacity: 0.5;
        }
        
        .watchlist-btn {
            position: absolute;
            top: var(--spacing-md);
            right: var(--spacing-md);
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        
        .watchlist-btn i {
            font-size: 20px;
            color: var(--desert-red);
            opacity: 1;
        }
        
        .watchlist-btn:hover {
            background-color: rgba(255, 255, 255, 1);
        }
        
        .card-content {
            padding: var(--spacing-md);
        }
        
        .card-title {
            font-size: 18px;
            margin-bottom: var(--spacing-sm);
            font-weight: 600;
        }
        
        .card-info {
            display: flex;
            justify-content: space-between;
            margin-top: var(--spacing-md);
        }
        
        .bid-info, .time-info {
            display: flex;
            flex-direction: column;
        }
        
        .label {
            font-size: 12px;
            color: var(--earthy-brown);
        }
        
        .value {
            font-weight: 600;
            font-size: 16px;
        }
        
        .bid-value {
            color: var(--golden-orange);
        }
        
        .time-value {
            color: var(--desert-red);
        }
        
        /* Footer */
        .footer {
            background-color: var(--dark-brown);
            color: var(--light-sand);
            padding: var(--spacing-xl) 0;
        }
        
        .footer-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .footer-logo {
            color: var(--golden-orange);
            font-family: 'Montserrat', sans-serif;
            font-weight: 700;
            font-size: 20px;
            text-decoration: none;
            display: flex;
            align-items: center;
        }
        
        .footer-logo i {
            margin-right: var(--spacing-xs);
        }
        
        .footer-links {
            display: flex;
            list-style: none;
        }
        
        .footer-links li {
            margin: 0 var(--spacing-md);
        }
        
        .footer-links a {
            color: var(--light-sand);
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .footer-links a:hover {
            color: var(--golden-orange);
        }
        
        .copyright {
            color: var(--light-sand);
            opacity: 0.7;
            font-size: 14px;
        }  
    </style>