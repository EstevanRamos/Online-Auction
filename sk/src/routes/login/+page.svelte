<!-- src/routes/login/+page.svelte -->
<script>
	import { authStore } from '$lib/stores/auth.svelte.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Form state
	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let rememberMe = $state(false);

	async function handleSubmit(event) {
		event.preventDefault();
		authStore.clearError();

		// Basic validation
		if (!email || !password) {
			authStore.error = 'Please fill in all fields';
			return;
		}
		console.log(email, password);
		await authStore.login(email, password);
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
</script>

<svelte:head>
	<title>Login - Auction Platform</title>
</svelte:head>

<div class="page-center">
	<div class="container">
		<!-- Login Form -->
		<div class="card">
			<div class="card-header">
				<h2 class="card-title">Login</h2>
				<p class="card-subtitle">Welcome back! Please enter your details</p>
			</div>
			<form onsubmit={handleSubmit}>
				<div class="form-group">
					<label class="form-label" for="login-email">Email</label>
					<input type="email" id="email" class="form-input" placeholder="Enter your email" bind:value={email} required disabled={authStore.loading} autocomplete="email" />
				</div>
				<div class="form-group">
					<label class="form-label" for="login-password">Password</label>
					<div class="password-field" style="position:relative;">
						<input type={showPassword ? 'text' : 'password'} id="password" class="form-input" placeholder="Enter your password" bind:value={password} required disabled={authStore.loading} autocomplete="current-password" />
						<button type="button" class="password-toggle" style="position:absolute;right:10px;top:50%;transform:translateY(-50%);" onclick={togglePasswordVisibility} disabled={authStore.loading}>
							{#if showPassword}
								<!-- Eye Off Icon -->
								<svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
								</svg>
							{:else}
								<!-- Eye Icon -->
								<svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
								</svg>
							{/if}
						</button>
					</div>
				</div>
				<div class="d-flex justify-between align-center">
					<div class="checkbox-group">
						<input type="checkbox" id="remember-me" class="checkbox-input" bind:checked={rememberMe} disabled={authStore.loading} />
						<label for="remember-me" class="checkbox-label">Remember me</label>
					</div>
					<a href="/reset-password" class="link">Forgot Password?</a>
				</div>
				{#if authStore.error}
					<div class="alert alert-danger mt-md">{authStore.error}</div>
				{/if}
				<button type="submit" class="btn btn-primary btn-block mt-lg" disabled={authStore.loading}>
					{#if authStore.loading}
						Signing in...
					{:else}
						Login
					{/if}
				</button>
				<p class="text-center mt-md">
					Don't have an account? <a href="/register" class="link">Register</a>
				</p>
			</form>
		</div>
	</div>
</div>

<style>
	.page-center {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background: var(--light-sand);
	}

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		max-width: 480px;
		margin: 0 auto;
		padding: var(--spacing-xl);
	}

	.card {
		background-color: var(--white);
		border-radius: var(--border-radius-lg);
		padding: var(--spacing-xl);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
		width: 100%;
		max-width: 420px;
	}

	.form-group {
		margin-bottom: var(--spacing-lg);
	}

	.form-label {
		display: block;
		margin-bottom: var(--spacing-xs);
		font-weight: 500;
		color: var(--dark-brown);
	}

	.form-input {
		width: 100%;
		padding: var(--spacing-md);
		border: 1px solid #DDD;
		border-radius: var(--border-radius-md);
		font-family: 'Open Sans', sans-serif;
		font-size: 14px;
		transition: border 0.3s ease;
	}

	.form-input:focus {
		outline: none;
		border-color: var(--golden-orange);
	}

	.password-field {
		position: relative;
	}

	.password-toggle {
		position: absolute;
		right: var(--spacing-md);
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		color: var(--earthy-brown);
		cursor: pointer;
	}

	.checkbox-group {
		display: flex;
		align-items: center;
		margin-bottom: var(--spacing-md);
	}

	.checkbox-input {
		margin-right: var(--spacing-xs);
		accent-color: var(--golden-orange);
		width: 16px;
		height: 16px;
	}

	.checkbox-label {
		font-size: 14px;
	}

	.btn {
		padding: var(--spacing-md) var(--spacing-xl);
		border-radius: var(--border-radius-md);
		font-family: 'Montserrat', sans-serif;
		font-weight: 600;
		font-size: 14px;
		cursor: pointer;
		transition: all 0.3s ease;
		border: none;
		display: inline-block;
		text-align: center;
	}

	.btn-primary {
		background-color: var(--golden-orange);
		color: var(--white);
	}

	.btn-primary:hover {
		background-color: #D99530;
	}

	.btn-secondary {
		background-color: transparent;
		color: var(--earthy-brown);
		border: 1px solid var(--earthy-brown);
	}

	.btn-secondary:hover {
		background-color: rgba(139, 107, 76, 0.1);
	}

	.btn-block {
		display: block;
		width: 100%;
	}

	.link {
		color: var(--earthy-brown);
		text-decoration: none;
		font-weight: 500;
		transition: color 0.3s ease;
	}

	.link:hover {
		color: var(--golden-orange);
	}

	.text-center {
		text-align: center;
	}

	.mt-md {
		margin-top: var(--spacing-md);
	}

	.mt-lg {
		margin-top: var(--spacing-lg);
	}

	.d-flex {
		display: flex;
	}

	.justify-between {
		justify-content: space-between;
	}

	.align-center {
		align-items: center;
	}

	.card-header {
		margin-bottom: var(--spacing-lg);
		padding-bottom: var(--spacing-md);
		border-bottom: 1px solid rgba(139, 107, 76, 0.2);
	}

	.card-title {
		font-size: 24px;
		font-weight: 700;
		color: var(--earthy-brown);
		margin-bottom: var(--spacing-xs);
	}

	.card-subtitle {
		font-size: 14px;
		color: #777;
	}

	.success-message {
		background-color: rgba(91, 138, 114, 0.1);
		border-left: 4px solid var(--cactus-green);
		padding: var(--spacing-md);
		border-radius: var(--border-radius-sm);
		margin-top: var(--spacing-lg);
	}

	.success-message i {
		color: var(--cactus-green);
		margin-right: var(--spacing-xs);
	}

	.page-title {
		text-align: center;
		margin-bottom: var(--spacing-xl);
		color: var(--earthy-brown);
		font-size: 32px;
	}

	.page-subtitle {
		text-align: center;
		margin-bottom: var(--spacing-xxl);
		color: var(--dark-brown);
		font-size: 16px;
		max-width: 600px;
		margin-left: auto;
		margin-right: auto;
	}
</style>