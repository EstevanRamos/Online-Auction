<!-- src/routes/reset-password/+page.svelte -->
<script>
	
	let email = '';
	let isSubmitted = false;

	async function handleSubmit(event) {
		event.preventDefault();
		authStore.clearError();

		if (!email) {
			authStore.error = 'Please enter your email address';
			return;
		}

		const result = await authStore.requestPasswordReset(email);
		
		if (result.success) {
			isSubmitted = true;
		}
	}
</script>

<svelte:head>
	<title>Reset Password - Auction Platform</title>
</svelte:head>

<div class="page-center">
	<div class="container">
		<div class="card">
			<div class="card-header">
				<h2 class="card-title">Reset Password</h2>
				<p class="card-subtitle">We'll send you a link to reset your password</p>
			</div>
			{#if !isSubmitted}
				<form onsubmit={handleSubmit}>
					<div class="form-group">
						<label class="form-label" for="reset-email">Email</label>
						<input
							type="email"
							id="reset-email"
							class="form-input"
							placeholder="Enter your email"
							bind:value={email}
							disabled={authStore.loading}
							required
						/>
					</div>
					{#if authStore.error}
						<div class="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
							<div class="flex">
								<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
									<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
								</svg>
								<div class="ml-3">
									<p class="text-sm text-red-800">{authStore.error}</p>
								</div>
							</div>
						</div>
					{/if}
					<button type="submit" class="btn btn-primary btn-block" disabled={authStore.loading}>
						{#if authStore.loading}
							<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
								<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
								<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							Sending...
						{:else}
							Send Reset Link
						{/if}
					</button>
					<p class="text-center mt-md">
						<a href="/login" class="link">Back to Login</a>
					</p>
				</form>
			{:else}
				<div class="success-message d-flex align-center">
					<i class="ri-mail-check-line" style="margin-right: var(--spacing-xs);"></i>
					Check your email for the password reset link. If you don't see it, check your spam folder.
				</div>
				<p class="text-center mt-md">
					<a href="/login" class="link">Back to Login</a>
				</p>
			{/if}
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

	.d-flex {
		display: flex;
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
</style>