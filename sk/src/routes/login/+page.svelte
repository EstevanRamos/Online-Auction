<!-- src/routes/login/+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';

	// Form state
	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
	let rememberMe = $state(false);
	let isSubmitting = $state(false);

	// Get form data from props
	let form = $props();

	// Field-specific errors
	let fieldErrors = $state({});

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}

	// Enhanced form handling with better error management
	function handleSubmit() {
		// Clear previous field errors
		fieldErrors = {};
		
		// Validate fields
		let hasErrors = false;
		
		if (!email.trim()) {
			fieldErrors.email = 'Email is required';
			hasErrors = true;
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			fieldErrors.email = 'Please enter a valid email address';
			hasErrors = true;
		}
		
		if (!password) {
			fieldErrors.password = 'Password is required';
			hasErrors = true;
		} else if (password.length < 6) {
			fieldErrors.password = 'Password must be at least 6 characters long';
			hasErrors = true;
		}
		
		if (hasErrors) {
			return false;
		}
		
		isSubmitting = true;
		return true;
	}

	// Clear field error when user starts typing
	function clearFieldError(fieldName) {
		if (fieldErrors[fieldName]) {
			fieldErrors[fieldName] = '';
		}
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
			
			<!-- Global Error Message -->
			{#if form?.error}
				<div class="alert alert-error" role="alert">
					<svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<div class="alert-content">
						<h3 class="alert-title">Login Failed</h3>
						<p class="alert-message">{form.error}</p>
					</div>
				</div>
			{/if}

			<!-- Success Message (if redirected back with success) -->
			{#if form?.success}
				<div class="alert alert-success" role="alert">
					<svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
					<div class="alert-content">
						<h3 class="alert-title">Success!</h3>
						<p class="alert-message">{form.success}</p>
					</div>
				</div>
			{/if}
			
			<form 
				method="POST" 
				action="?/login" 
				use:enhance={() => {
					return async ({ result, update }) => {
						isSubmitting = false;
						
						if (result.type === 'failure') {
							// Handle validation errors
							if (result.data?.fieldErrors) {
								fieldErrors = result.data.fieldErrors;
							}
						}
						
						await update();
					};
				}}
				on:submit={handleSubmit}
			>
				<div class="form-group">
					<label class="form-label" for="email">Email</label>
					<input 
						type="email" 
						id="email" 
						name="email" 
						bind:value={email}
						class="form-input {fieldErrors.email ? 'form-input-error' : ''}" 
						placeholder="Enter your email"  
						required 
						autocomplete="email"
						on:input={() => clearFieldError('email')}
						disabled={isSubmitting}
					/>
					{#if fieldErrors.email}
						<div class="field-error" role="alert">
							<svg class="field-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							{fieldErrors.email}
						</div>
					{/if}
				</div>

				<div class="form-group">
					<label class="form-label" for="password">Password</label>
					<div class="password-field">
						<input 
							type={showPassword ? 'text' : 'password'} 
							id="password" 
							name="password" 
							bind:value={password}
							class="form-input {fieldErrors.password ? 'form-input-error' : ''}" 
							placeholder="Enter your password"  
							required  
							autocomplete="current-password"
							on:input={() => clearFieldError('password')}
							disabled={isSubmitting}
						/>
						<button 
							type="button" 
							class="password-toggle" 
							on:click={togglePasswordVisibility}
							disabled={isSubmitting}
						>
							{#if showPassword}
								<!-- Eye Off Icon -->
								<svg class="password-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
								</svg>
							{:else}
								<!-- Eye Icon -->
								<svg class="password-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
								</svg>
							{/if}
						</button>
					</div>
					{#if fieldErrors.password}
						<div class="field-error" role="alert">
							<svg class="field-error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
							{fieldErrors.password}
						</div>
					{/if}
				</div>

				<div class="d-flex justify-between align-center">
					<div class="checkbox-group">
						<input 
							type="checkbox" 
							id="remember-me" 
							name="rememberMe" 
							bind:checked={rememberMe}
							class="checkbox-input" 
							disabled={isSubmitting}
						/>
						<label for="remember-me" class="checkbox-label">Remember me</label>
					</div>
					<a href="/reset-password" class="link">Forgot Password?</a>
				</div>

				<button 
					type="submit" 
					class="btn btn-primary btn-block mt-lg {isSubmitting ? 'btn-loading' : ''}" 
					disabled={isSubmitting}
				>
					{#if isSubmitting}
						<svg class="btn-spinner" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Logging in...
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
	/* CSS Variables for consistent theming */
	:global(:root) {
		--error-color: #ef4444;
		--error-bg: rgba(239, 68, 68, 0.1);
		--error-border: #ef4444;
		--success-color: #10b981;
		--success-bg: rgba(16, 185, 129, 0.1);
		--success-border: #10b981;
		--warning-color: #f59e0b;
		--warning-bg: rgba(245, 158, 11, 0.1);
		--warning-border: #f59e0b;
	}

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
		transition: all 0.3s ease;
		background-color: var(--white);
	}

	.form-input:focus {
		outline: none;
		border-color: var(--golden-orange);
		box-shadow: 0 0 0 3px rgba(217, 149, 48, 0.1);
	}

	.form-input:disabled {
		background-color: #f9fafb;
		cursor: not-allowed;
		opacity: 0.7;
	}

	.form-input-error {
		border-color: var(--error-color);
		border-width: 2px;
		background-color: var(--error-bg);
	}

	.form-input-error:focus {
		border-color: var(--error-color);
		box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
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
		padding: var(--spacing-xs);
		border-radius: var(--border-radius-sm);
		transition: all 0.2s ease;
	}

	.password-toggle:hover:not(:disabled) {
		background-color: rgba(139, 107, 76, 0.1);
		color: var(--golden-orange);
	}

	.password-toggle:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.password-toggle-icon {
		width: 20px;
		height: 20px;
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
		cursor: pointer;
	}

	.checkbox-input:disabled {
		cursor: not-allowed;
		opacity: 0.7;
	}

	.checkbox-label {
		font-size: 14px;
		cursor: pointer;
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
		position: relative;
	}

	.btn-primary {
		background-color: var(--golden-orange);
		color: var(--white);
	}

	.btn-primary:hover:not(:disabled) {
		background-color: #D99530;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(217, 149, 48, 0.3);
	}

	.btn-primary:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: 0 2px 8px rgba(217, 149, 48, 0.3);
	}

	.btn-secondary {
		background-color: transparent;
		color: var(--earthy-brown);
		border: 1px solid var(--earthy-brown);
	}

	.btn-secondary:hover:not(:disabled) {
		background-color: rgba(139, 107, 76, 0.1);
	}

	.btn-block {
		display: block;
		width: 100%;
	}

	.btn-loading {
		opacity: 0.8;
		cursor: not-allowed;
		transform: none !important;
		box-shadow: none !important;
	}

	.btn-spinner {
		animation: spin 1s linear infinite;
		margin-right: var(--spacing-xs);
		width: 16px;
		height: 16px;
	}

	@keyframes spin {
		from { transform: rotate(0deg); }
		to { transform: rotate(360deg); }
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

	/* Field error styles */
	.field-error {
		display: flex;
		align-items: center;
		color: var(--error-color);
		font-size: 12px;
		margin-top: var(--spacing-xs);
		margin-left: var(--spacing-xs);
		animation: slideIn 0.3s ease;
	}

	.field-error-icon {
		margin-right: var(--spacing-xs);
		width: 16px;
		height: 16px;
		flex-shrink: 0;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Alert styles */
	.alert {
		display: flex;
		align-items: flex-start;
		padding: var(--spacing-md);
		border-radius: var(--border-radius-md);
		margin-bottom: var(--spacing-lg);
		font-size: 14px;
		animation: slideIn 0.3s ease;
		border: 1px solid;
	}

	.alert-success {
		background-color: var(--success-bg);
		border-color: var(--success-border);
		color: var(--success-color);
	}

	.alert-error {
		background-color: var(--error-bg);
		border-color: var(--error-border);
		color: var(--error-color);
	}

	.alert-icon {
		width: 20px;
		height: 20px;
		margin-right: var(--spacing-sm);
		flex-shrink: 0;
		margin-top: 2px;
	}

	.alert-content {
		flex-grow: 1;
	}

	.alert-title {
		font-weight: 600;
		margin-bottom: var(--spacing-xs);
		font-size: 14px;
	}

	.alert-message {
		color: inherit;
		margin: 0;
		line-height: 1.4;
	}

	/* Responsive adjustments */
	@media (max-width: 480px) {
		.container {
			padding: var(--spacing-md);
		}
		
		.card {
			padding: var(--spacing-lg);
		}
		
		.card-title {
			font-size: 20px;
		}
	}
</style>