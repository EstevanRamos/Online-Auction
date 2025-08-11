<script>
	let selectedCategory = "all";
	let selectedTimeframe = "all";
	let selectedSort = "ending-soon";
	let showCategoryDropdown = false;
	let showTimeframeDropdown = false;
	let showSortDropdown = false;

	const categories = [
		{ value: "all", label: "All Categories" },
		{ value: "antiques", label: "Antiques" },
		{ value: "jewelry", label: "Jewelry" },
		{ value: "art", label: "Art & Collectibles" },
		{ value: "furniture", label: "Furniture" },
		{ value: "electronics", label: "Electronics" },
	];

	const timeframes = [
		{ value: "all", label: "All Time" },
		{ value: "today", label: "Today" },
		{ value: "week", label: "This Week" },
		{ value: "month", label: "This Month" },
	];

	const sortOptions = [
		{ value: "ending-soon", label: "Ending Soon" },
		{ value: "newest", label: "Newest First" },
		{ value: "most-bids", label: "Most Bids" },
		{ value: "highest-value", label: "Highest Value" },
	];

	function selectCategory(value) {
		selectedCategory = value;
		showCategoryDropdown = false;
	}

	function selectTimeframe(value) {
		selectedTimeframe = value;
		showTimeframeDropdown = false;
	}

	function selectSort(value) {
		selectedSort = value;
		showSortDropdown = false;
	}

	function removeFilter(filterType) {
		if (filterType === "category") selectedCategory = "all";
		if (filterType === "timeframe") selectedTimeframe = "all";
	}
</script>

<div class="filter">
	<div class="filter-row">
		<!-- Filter Title -->
		<div class="filter-title">
			<svg class="icon icon-lg icon-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
			</svg>
			<h3 class="title" style="font-family: Montserrat, sans-serif;">Filter Auctions</h3>
		</div>

		<!-- Filters -->
		<div class="filters">
			<!-- Category Filter -->
			<div class="filter-group">
				<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
				</svg>
				<button class="dropdown-trigger trigger-40" onclick={() => (showCategoryDropdown = !showCategoryDropdown)}>
					<span class="text-sm" style="font-family: 'Open Sans', sans-serif;">
						{categories.find((c) => c.value === selectedCategory)?.label}
					</span>
					<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</button>
				{#if showCategoryDropdown}
					<div class="dropdown-menu menu-40">
						{#each categories as category}
							<button class="menu-item" onclick={() => selectCategory(category.value)} style="font-family: 'Open Sans', sans-serif;">
								{category.label}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Timeframe Filter -->
			<div class="filter-group">
				<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
				</svg>
				<button class="dropdown-trigger trigger-36" onclick={() => (showTimeframeDropdown = !showTimeframeDropdown)}>
					<span class="text-sm" style="font-family: 'Open Sans', sans-serif;">
						{timeframes.find((t) => t.value === selectedTimeframe)?.label}
					</span>
					<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</button>
				{#if showTimeframeDropdown}
					<div class="dropdown-menu menu-36">
						{#each timeframes as timeframe}
							<button class="menu-item" onclick={() => selectTimeframe(timeframe.value)} style="font-family: 'Open Sans', sans-serif;">
								{timeframe.label}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Sort Filter -->
			<div class="filter-group">
				<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
				</svg>
				<button class="dropdown-trigger trigger-40" onclick={() => (showSortDropdown = !showSortDropdown)}>
					<span class="text-sm" style="font-family: 'Open Sans', sans-serif;">
						{sortOptions.find((s) => s.value === selectedSort)?.label}
					</span>
					<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</button>
				{#if showSortDropdown}
					<div class="dropdown-menu menu-40">
						{#each sortOptions as option}
							<button class="menu-item" onclick={() => selectSort(option.value)} style="font-family: 'Open Sans', sans-serif;">
								{option.label}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>

		<!-- Active Filters -->
		<div class="active-filters">
			{#if selectedCategory !== "all"}
				<span class="filter-badge">
					{categories.find((c) => c.value === selectedCategory)?.label}
					<button class="badge-close" onclick={() => removeFilter("category")}>×</button>
				</span>
			{/if}
			{#if selectedTimeframe !== "all"}
				<span class="filter-badge">
					{timeframes.find((t) => t.value === selectedTimeframe)?.label}
					<button class="badge-close" onclick={() => removeFilter("timeframe")}>×</button>
				</span>
			{/if}
		</div>
	</div>
</div>

<style>
  .filter {
    background-color: hsl(var(--card));
    border: 1px solid hsl(var(--border));
    border-radius: 0.75rem; /* rounded-xl */
    padding: 1.5rem; /* p-6 */
    margin-bottom: 2rem; /* mb-8 */
    box-shadow: 0 1px 2px 0 hsl(0 0% 0% / 0.05); /* shadow-sm */
  }

  .filter-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem; /* gap-6 */
  }

  @media (min-width: 1024px) {
    .filter-row {
      flex-direction: row; /* lg:flex-row */
      align-items: center; /* lg:items-center */
    }
  }

  .filter-title {
    display: flex;
    align-items: center;
    gap: 0.5rem; /* gap-2 */
  }

  .title {
    font-weight: 600; /* font-semibold */
    color: hsl(var(--foreground));
  }

  .filters {
    display: flex;
    flex-direction: column;
    align-items: flex-start; /* items-start */
    gap: 1rem; /* gap-4 */
    flex: 1 1 auto; /* flex-1 */
  }

  @media (min-width: 640px) {
    .filters {
      flex-direction: row; /* sm:flex-row */
      align-items: center; /* sm:items-center */
    }
  }

  .filter-group {
    position: relative; /* relative */
    display: flex;
    align-items: center; /* items-center */
    gap: 0.5rem; /* gap-2 */
  }

  .icon {
    width: 1rem; /* w-4 */
    height: 1rem; /* h-4 */
    color: hsl(var(--muted-foreground));
  }

  .icon-lg {
    width: 1.25rem; /* w-5 */
    height: 1.25rem; /* h-5 */
  }

  .icon-primary {
    color: hsl(var(--primary));
  }

  .dropdown-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem; /* py-2 px-3 */
    background-color: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: 0.5rem; /* rounded-lg */
    transition: background-color 150ms ease, color 150ms ease;
  }

  .dropdown-trigger:hover {
    background-color: hsl(var(--muted) / 0.5); /* hover:bg-muted/50 */
  }

  .trigger-40 { width: 10rem; }
  .trigger-36 { width: 9rem; }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 0.25rem); /* mt-1 below trigger */
    left: 0;
    background-color: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: 0.5rem; /* rounded-lg */
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1); /* shadow-lg */
    z-index: 10; /* z-10 */
    overflow: hidden;
  }

  .menu-40 { width: 10rem; }
  .menu-36 { width: 9rem; }

  .menu-item {
    width: 100%;
    padding: 0.5rem 0.75rem; /* py-2 px-3 */
    text-align: left;
    font-size: 0.875rem; /* text-sm */
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background-color 150ms ease, color 150ms ease;
    color: inherit;
  }

  .menu-item:hover {
    background-color: hsl(var(--muted) / 0.5); /* hover:bg-muted/50 */
  }

  .active-filters {
    display: flex;
    align-items: center;
    gap: 0.5rem; /* gap-2 */
  }

  .filter-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem; /* gap-1 */
    padding: 0.25rem 0.5rem; /* py-1 px-2 */
    background-color: hsl(var(--secondary) / 0.2); /* bg-secondary/20 */
    color: hsl(var(--secondary));
    border-radius: 0.375rem; /* rounded-md */
    font-size: 0.875rem; /* text-sm */
  }

  .badge-close {
    margin-left: 0.25rem; /* ml-1 */
    background: none;
    border: none;
    cursor: pointer;
    transition: color 150ms ease;
  }

  .badge-close:hover {
    color: #ef4444; /* red-500 */
  }
</style>
