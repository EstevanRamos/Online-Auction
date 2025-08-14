<script>
	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';

	// Props
	let { initialFilters = {} } = $props();

	// Event dispatcher for parent components
	const dispatch = createEventDispatcher();

	// Initialize state from props or localStorage
	let selectedCategory = $state(initialFilters.category || (browser && localStorage.getItem('auction-filter-category')) || "all");
	let selectedTimeframe = $state(initialFilters.timeframe || (browser && localStorage.getItem('auction-filter-timeframe')) || "all");
	let selectedSort = $state(initialFilters.sort || (browser && localStorage.getItem('auction-filter-sort')) || "ending-soon");
	let showCategoryDropdown = $state(false);
	let showTimeframeDropdown = $state(false);
	let showSortDropdown = $state(false);

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
		{ value: "price-low", label: "Price: Low to High" },
		{ value: "price-high", label: "Price: High to Low" },
		{ value: "ending-today", label: "Ending Today" },
		{ value: "most-watched", label: "Most Watched" },
		{ value: "reserve-met", label: "Reserve Met" },
		{ value: "reserve-not-met", label: "Reserve Not Met" },
		{ value: "recently-added", label: "Recently Added" },
		{ value: "alphabetical", label: "A-Z" },
	];

	function selectCategory(value) {
		selectedCategory = value;
		showCategoryDropdown = false;
		savePreferences();
		emitFilterChange();
	}

	function selectTimeframe(value) {
		selectedTimeframe = value;
		showTimeframeDropdown = false;
		savePreferences();
		emitFilterChange();
	}

	function selectSort(value) {
		selectedSort = value;
		showSortDropdown = false;
		savePreferences();
		emitFilterChange();
	}

	function removeFilter(filterType) {
		if (filterType === "category") selectedCategory = "all";
		if (filterType === "timeframe") selectedTimeframe = "all";
		savePreferences();
		emitFilterChange();
	}

	function savePreferences() {
		if (browser) {
			localStorage.setItem('auction-filter-category', selectedCategory);
			localStorage.setItem('auction-filter-timeframe', selectedTimeframe);
			localStorage.setItem('auction-filter-sort', selectedSort);
		}
	}

	function emitFilterChange() {
		dispatch('filterChange', {
			category: selectedCategory,
			timeframe: selectedTimeframe,
			sort: selectedSort
		});
	}

	function clearAllFilters() {
		selectedCategory = "all";
		selectedTimeframe = "all";
		selectedSort = "ending-soon";
		savePreferences();
		emitFilterChange();
	}

	// Close dropdowns when clicking outside
	function handleClickOutside(event) {
		if (!event.target.closest('.filter-group')) {
			showCategoryDropdown = false;
			showTimeframeDropdown = false;
			showSortDropdown = false;
		}
	}

	// Add click outside listener
	import { onMount, onDestroy } from 'svelte';
	
	onMount(() => {
		document.addEventListener('click', handleClickOutside);
	});
	
	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
	});
</script>

<div class="filter">
	<div class="filter-row">
		<!-- Filter Title -->
		<div class="filter-title">
			<svg class="icon icon-lg icon-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
			</svg>
			<h3 class="title">Filter Auctions</h3>
		</div>

		<!-- Filters -->
		<div class="filters">
			<!-- Category Filter -->
			<div class="filter-group">
				<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
				</svg>
				<button class="dropdown-trigger" onclick={() => (showCategoryDropdown = !showCategoryDropdown)}>
					<span class="text-sm">
						{categories.find((c) => c.value === selectedCategory)?.label}
					</span>
					<svg class="icon dropdown-arrow" class:rotated={showCategoryDropdown} fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</button>
				{#if showCategoryDropdown}
					<div class="dropdown-menu">
						{#each categories as category}
							<button class="menu-item" onclick={() => selectCategory(category.value)}>
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
				<button class="dropdown-trigger" onclick={() => (showTimeframeDropdown = !showTimeframeDropdown)}>
					<span class="text-sm">
						{timeframes.find((t) => t.value === selectedTimeframe)?.label}
					</span>
					<svg class="icon dropdown-arrow" class:rotated={showTimeframeDropdown} fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</button>
				{#if showTimeframeDropdown}
					<div class="dropdown-menu">
						{#each timeframes as timeframe}
							<button class="menu-item" onclick={() => selectTimeframe(timeframe.value)}>
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
				<button class="dropdown-trigger" onclick={() => (showSortDropdown = !showSortDropdown)}>
					<span class="text-sm">
						{sortOptions.find((s) => s.value === selectedSort)?.label}
					</span>
					<svg class="icon dropdown-arrow" class:rotated={showSortDropdown} fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
					</svg>
				</button>
				{#if showSortDropdown}
					<div class="dropdown-menu">
						{#each sortOptions as option}
							<button class="menu-item" onclick={() => selectSort(option.value)}>
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
			{#if selectedSort !== "ending-soon"}
				<span class="filter-badge sort-badge">
					Sort: {sortOptions.find((s) => s.value === selectedSort)?.label}
					<button class="badge-close" onclick={() => selectSort("ending-soon")}>×</button>
				</span>
			{/if}
			{#if selectedCategory !== "all" || selectedTimeframe !== "all" || selectedSort !== "ending-soon"}
				<button class="clear-all-btn" onclick={clearAllFilters}>
					<svg class="clear-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
					Clear All
				</button>
			{/if}
		</div>
	</div>
</div>

<style>
  .filter {
    background-color: var(--white);
    border: 1px solid var(--earthy-brown);
    border-radius: 0.75rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .filter-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }

  @media (min-width: 1024px) {
    .filter-row {
      flex-direction: row;
      align-items: center;
    }
  }

  .filter-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .title {
    font-weight: 600;
    color: var(--dark-brown);
    font-family: 'Montserrat', sans-serif;
    font-size: 1.125rem;
  }

  .filters {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    flex: 1 1 auto;
    width: 100%;
  }

  @media (min-width: 640px) {
    .filters {
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
    }
  }

  @media (min-width: 1024px) {
    .filters {
      flex-wrap: nowrap;
    }
  }

  .filter-group {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
  }

  @media (min-width: 640px) {
    .filter-group {
      flex: 1;
      min-width: 200px;
    }
  }

  .icon {
    width: 1rem;
    height: 1rem;
    color: var(--earthy-brown);
    flex-shrink: 0;
  }

  .icon-lg {
    width: 1.25rem;
    height: 1.25rem;
  }

  .icon-primary {
    color: var(--golden-orange);
  }

  .dropdown-arrow {
    transition: transform 0.2s ease;
  }

  .dropdown-arrow.rotated {
    transform: rotate(180deg);
  }

  .dropdown-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background-color: var(--white);
    border: 1px solid var(--earthy-brown);
    border-radius: 0.5rem;
    transition: all 0.2s ease;
    cursor: pointer;
    width: 100%;
    min-width: 0;
    font-family: 'Open Sans', sans-serif;
    font-size: 0.875rem;
    color: var(--dark-brown);
  }

  .dropdown-trigger:hover {
    background-color: var(--light-sand);
    border-color: var(--golden-orange);
  }

  .dropdown-trigger:focus {
    outline: none;
    border-color: var(--golden-orange);
    box-shadow: 0 0 0 3px rgba(217, 149, 48, 0.1);
  }

  .text-sm {
    font-size: 0.875rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 0.25rem);
    left: 0;
    right: 0;
    background-color: var(--white);
    border: 1px solid var(--earthy-brown);
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
    z-index: 50;
    overflow: hidden;
    max-height: 300px;
    overflow-y: auto;
  }

  @media (min-width: 640px) {
    .dropdown-menu {
      min-width: 200px;
      right: auto;
    }
  }

  .menu-item {
    width: 100%;
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.875rem;
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    color: var(--dark-brown);
    font-family: 'Open Sans', sans-serif;
    border-bottom: 1px solid rgba(139, 94, 52, 0.1);
  }

  .menu-item:last-child {
    border-bottom: none;
  }

  .menu-item:hover {
    background-color: var(--light-sand);
  }

  .menu-item:focus {
    outline: none;
    background-color: var(--light-sand);
  }

  .active-filters {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    width: 100%;
  }

  @media (min-width: 1024px) {
    .active-filters {
      width: auto;
      flex-shrink: 0;
    }
  }

  .filter-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    background-color: var(--golden-orange);
    color: var(--white);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: 'Open Sans', sans-serif;
  }

  .badge-close {
    margin-left: 0.25rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.2s ease;
    color: var(--white);
    font-size: 1.125rem;
    font-weight: bold;
    padding: 0;
    width: 1.25rem;
    height: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
  }

  .badge-close:hover {
    background-color: rgba(253, 251, 247, 0.2);
  }

  .sort-badge {
    background-color: var(--earthy-brown);
    color: var(--white);
  }

  .clear-all-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    background-color: transparent;
    color: var(--desert-red);
    border: 1px solid var(--desert-red);
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: 'Open Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .clear-all-btn:hover {
    background-color: var(--desert-red);
    color: var(--white);
  }

  .clear-icon {
    width: 1rem;
    height: 1rem;
  }

  /* Mobile optimizations */
  @media (max-width: 639px) {
    .filter {
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .filter-row {
      gap: 1rem;
    }

    .filter-title {
      width: 100%;
      justify-content: center;
    }

    .filters {
      gap: 0.75rem;
    }

    .dropdown-trigger {
      padding: 0.625rem 0.875rem;
    }

    .filter-badge {
      padding: 0.375rem 0.625rem;
      font-size: 0.75rem;
    }
  }

  /* Ensure dropdowns don't get cut off on small screens */
  @media (max-width: 480px) {
    .dropdown-menu {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: calc(100vw - 2rem);
      max-width: 300px;
      max-height: 60vh;
      z-index: 100;
    }

    .filter-group {
      position: static;
    }
  }
</style>
