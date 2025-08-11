<!-- src/routes/register/+page.svelte -->
<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';

	// Form state
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let displayName = $state('');
	let fullName = $state('');
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let acceptTerms = $state(false);

	// Validation state
	let fieldErrors = $state({});
	let isFormValid = $derived(() => {
		return email && 
			   password && 
			   confirmPassword && 
			   displayName && 
			   fullName &&
			   password === confirmPassword && 
			   password.length >= 8 && 
			   acceptTerms &&
			   Object.keys(fieldErrors).length === 0;
	});

	// Password strength indicator
	let passwordStrength = $derived(() => {
		if (!password) return { score: 0, text: '', color: '' };
		
		let score = 0;
		if (password.length >= 8) score++;
		if (/[a-z]/.test(password)) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;

		const strength = {
			0: { text: 'Very weak', color: 'bg-red-500' },
			1: { text: 'Weak', color: 'bg-red-400' },
			2: { text: 'Fair', color: 'bg-yellow-400' },
			3: { text: 'Good', color: 'bg-blue-400' },
			4: { text: 'Strong', color: 'bg-green-400' },
			5: { text: 'Very strong', color: 'bg-green-500' }
		};

		return { score, ...strength[score] };
	});

	function validateEmail() {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (email && !emailRegex.test(email)) {
			fieldErrors.email = 'Please enter a valid email address';
		} else {
			delete fieldErrors.email;
		}
		fieldErrors = { ...fieldErrors };
	}

	function validatePassword() {
		if (password && password.length < 8) {
			fieldErrors.password = 'Password must be at least 8 characters long';
		} else {
			delete fieldErrors.password;
		}
		fieldErrors = { ...fieldErrors };
	}

	function validateConfirmPassword() {
		if (confirmPassword && password !== confirmPassword) {
			fieldErrors.confirmPassword = 'Passwords do not match';
		} else {
			delete fieldErrors.confirmPassword;
		}
		fieldErrors = { ...fieldErrors };
	}

	function validateDisplayName() {
		if (displayName && displayName.length < 2) {
			fieldErrors.displayName = 'Display name must be at least 2 characters';
		} else if (displayName && displayName.length > 50) {
			fieldErrors.displayName = 'Display name must be less than 50 characters';
		} else {
			delete fieldErrors.displayName;
		}
		fieldErrors = { ...fieldErrors };
	}

	function validateFullName() {
		if (fullName && fullName.length < 2) {
			fieldErrors.fullName = 'Full name must be at least 2 characters';
		} else if (fullName && fullName.length > 100) {
			fieldErrors.fullName = 'Full name must be less than 100 characters';
		} else if (!fullName) {
			fieldErrors.fullName = 'Full name is required';
		} else {
			delete fieldErrors.fullName;
		}
		fieldErrors = { ...fieldErrors };
	}

	async function handleSubmit(event) {
		event.preventDefault();
		authStore.clearError();

		// Final validation
		if (!isFormValid) {
			authStore.error = 'Please fix the form errors before submitting';
			return;
		}

		const result = await authStore.register(email, password, displayName, fullName);
		
		if (result.success) {
			// Registration successful, user will be redirected by the auth store
			console.log('Registration successful');
		}
	}

	function togglePasswordVisibility(field) {
		if (field === 'password') {
			showPassword = !showPassword;
		} else if (field === 'confirmPassword') {
			showConfirmPassword = !showConfirmPassword;
		}
	}
</script>

<svelte:head>
	<title>Register - Auction Platform</title>
</svelte:head>

<!-- Register Form (Combined: Card style + Svelte logic) -->
<div class="page-center">
	<div class="container">
		<div class="card">
			<div class="card-header">
				<h2 class="card-title">Create Account</h2>
				<p class="card-subtitle">Join our daily auction community</p>
			</div>
			<form method="POST" action="?/register" use:enhance>
				<!-- Full Name Field -->
				<div class="form-group">
					<label class="form-label" for="full-name">Full Name</label>
					<input
						type="text"
						id="full-name"
						class="form-input"
						placeholder="Enter your full name"
						bind:value={fullName}
						onblur={validateFullName}
						disabled={authStore.loading}
						class:border-red-500={fieldErrors.fullName}
					/>
					{#if fieldErrors.fullName}
						<p class="mt-1 text-sm text-red-600">{fieldErrors.fullName}</p>
					{/if}
				</div>
				<!-- Display Name Field -->
				<div class="form-group">
					<label class="form-label" for="register-name">Display Name</label>
					<input
						type="text"
						id="register-name"
						class="form-input"
						placeholder="Enter your display name"
						bind:value={displayName}
						onblur={validateDisplayName}
						disabled={authStore.loading}
						class:border-red-500={fieldErrors.displayName}
					/>
					{#if fieldErrors.displayName}
						<p class="mt-1 text-sm text-red-600">{fieldErrors.displayName}</p>
					{/if}
				</div>
				<!-- Email Field -->
				<div class="form-group">
					<label class="form-label" for="register-email">Email</label>
					<input
						type="email"
						id="register-email"
						class="form-input"
						placeholder="Enter your email"
						bind:value={email}
						onblur={validateEmail}
						disabled={authStore.loading}
						class:border-red-500={fieldErrors.email}
					/>
					{#if fieldErrors.email}
						<p class="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
					{/if}
				</div>
				<!-- Password Field -->
				<div class="form-group">
					<label class="form-label" for="register-password">Password</label>
					<div class="password-field">
						<input
							type={showPassword ? 'text' : 'password'}
							id="register-password"
							class="form-input"
							placeholder="Create a password"
							bind:value={password}
							oninput={validatePassword}
							disabled={authStore.loading}
							class:border-red-500={fieldErrors.password}
						/>
						<button type="button" class="password-toggle" onclick={() => togglePasswordVisibility('password')} disabled={authStore.loading}>
							<i class="ri-eye-line"></i>
							Show Password
						</button>
					</div>
					<!-- Password Strength Indicator -->
					{#if password}
						<div class="mt-2">
							<div class="flex items-center justify-between text-xs text-gray-600 mb-1">
								<span>Password strength:</span>
								<span class="font-medium">{passwordStrength.text}</span>
							</div>
							<div class="w-full bg-gray-200 rounded-full h-2">
								<div 
									class="h-2 rounded-full transition-all duration-300 {passwordStrength.color}"
									style="width: {(passwordStrength.score / 5) * 100}%"
								></div>
							</div>
						</div>
					{/if}
					{#if fieldErrors.password}
						<p class="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
					{/if}
				</div>
				<!-- Confirm Password Field -->
				<div class="form-group">
					<label class="form-label" for="confirm-password">Confirm Password</label>
					<div class="password-field">
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							id="confirm-password"
							class="form-input"
							placeholder="Confirm your password"
							bind:value={confirmPassword}
							onblur={validateConfirmPassword}
							disabled={authStore.loading}
							class:border-red-500={fieldErrors.confirmPassword}
						/>
						<button type="button" class="password-toggle" onclick={() => togglePasswordVisibility('confirmPassword')} disabled={authStore.loading}>
							<i class="ri-eye-line"></i>
							Show Password
						</button>
					</div>
					{#if fieldErrors.confirmPassword}
						<p class="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
					{/if}
				</div>
				<!-- Terms and Conditions -->
				<div class="checkbox-group">
					<input
						type="checkbox"
						id="terms"
						class="checkbox-input"
						bind:checked={acceptTerms}
						disabled={authStore.loading}
						required
					/>
					<label for="terms" class="checkbox-label">
						I agree to the <a href="/terms" class="link">Terms &amp; Conditions</a>
					</label>
				</div>
				<!-- Error Message -->
				{#if authStore.error}
					<div class="bg-red-50 border border-red-200 rounded-md p-3">
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
				<!-- Submit Button -->
				<button formaction="?/register" class="btn btn-primary btn-block mt-lg" disabled={authStore.loading || !isFormValid}>
					{#if authStore.loading}
						<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
							<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
							<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Creating account...
					{:else}
						Register
					{/if}
				</button>
				<!-- Password Requirements -->
				<div class="requirements-box">
					<p class="font-medium d-flex align-center" style="margin-bottom: var(--spacing-xs);">
						<i class="ri-key-line" style="margin-right: var(--spacing-xs);"></i>
						Password requirements:
					</p>
					<ul class="requirements-list">
						<li>At least 8 characters long</li>
						<li>Mix of uppercase and lowercase letters</li>
						<li>At least one number</li>
						<li>Special characters recommended</li>
					</ul>
				</div>
				<!-- Already have an account -->
				<p class="text-center mt-md">
					Already have an account? <a href="/login" class="link">Login</a>
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

.requirements-box {
  background: #fdfbf7;
  border-left: 4px solid var(--golden-orange);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  margin-top: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.requirements-list {
  margin: 0;
  padding-left: var(--spacing-lg);
  color: var(--earthy-brown);
  font-size: 14px;
  list-style: disc inside;
}

.requirements-list li {
  margin-bottom: var(--spacing-xs);
}
</style>