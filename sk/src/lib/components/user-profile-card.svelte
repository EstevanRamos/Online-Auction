<script>
  import { userStore } from '$lib/stores/user.svelte.js';
  import { formatDate } from '$lib/utils/datetime.js';

  // Props
  let { className = '' } = $props();

  // Get user data
  const user = $derived(userStore.user);
  const isAuthenticated = $derived(userStore.isAuthenticated);

  // Format join date
  function formatJoinDate(date) {
    if (!date) return 'Unknown';
    try {
      return formatDate(date);
    } catch {
      return 'Unknown';
    }
  }

  // Get user initials for avatar
  function getUserInitials(user) {
    if (!user) return 'U';
    
    const firstName = user.first_name || user.name || '';
    const lastName = user.last_name || '';
    
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    
    return firstInitial + lastInitial || 'U';
  }

  // Get display name
  function getDisplayName(user) {
    if (!user) return 'Guest User';
    
    const firstName = user.first_name || user.name || '';
    const lastName = user.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'User';
  }
</script>

{#if isAuthenticated && user}
  <div class="user-profile-card {className}">
    <div class="profile-header">
      <div class="avatar-container">
        {#if user.avatar}
          <img src={user.avatar} alt="Profile" class="avatar-image" />
        {:else}
          <div class="avatar-placeholder">
            {getUserInitials(user)}
          </div>
        {/if}
      </div>
      
      <div class="user-info">
        <h3 class="user-name">{getDisplayName(user)}</h3>
        <p class="user-email">{user.email || 'No email provided'}</p>
      </div>
    </div>

    <div class="profile-details">
      <div class="detail-row">
        <span class="detail-label">Member Since</span>
        <span class="detail-value">{formatJoinDate(user.created)}</span>
      </div>
      
      {#if user.phone}
        <div class="detail-row">
          <span class="detail-label">Phone</span>
          <span class="detail-value">{user.phone}</span>
        </div>
      {/if}
      
      <div class="detail-row">
        <span class="detail-label">Account Status</span>
        <span class="detail-value status-active">
          {user.verified ? 'Verified' : 'Unverified'}
        </span>
      </div>
      
      {#if user.address}
        <div class="detail-row">
          <span class="detail-label">Location</span>
          <span class="detail-value">{user.address}</span>
        </div>
      {/if}
    </div>

    <div class="profile-actions">
      <a href="/dashboard/profile" class="edit-profile-btn">
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit Profile
      </a>
    </div>
  </div>
{:else}
  <div class="user-profile-card guest {className}">
    <div class="guest-content">
      <h3>Welcome, Guest</h3>
      <p>Please log in to view your profile</p>
      <a href="/login" class="login-btn">Log In</a>
    </div>
  </div>
{/if}

<style>
  .user-profile-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #eee;
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .avatar-container {
    flex-shrink: 0;
  }

  .avatar-image {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #f8f9fa;
  }

  .avatar-placeholder {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--desert-red, #cd5c5c), var(--golden-orange, #d99530));
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 1.5rem;
    border: 3px solid #f8f9fa;
  }

  .user-info {
    flex: 1;
  }

  .user-name {
    margin: 0 0 0.25rem 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #333;
  }

  .user-email {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
  }

  .profile-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .detail-label {
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
  }

  .detail-value {
    font-size: 0.9rem;
    color: #333;
    font-weight: 600;
    text-align: right;
  }

  .status-active {
    color: #10b981;
  }

  .profile-actions {
    display: flex;
    justify-content: center;
  }

  .edit-profile-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: var(--desert-red, #cd5c5c);
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }

  .edit-profile-btn:hover {
    background: #b84a4a;
  }

  .btn-icon {
    width: 16px;
    height: 16px;
  }

  /* Guest state */
  .user-profile-card.guest {
    text-align: center;
    padding: 2rem;
  }

  .guest-content h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  .guest-content p {
    margin: 0 0 1rem 0;
    color: #666;
  }

  .login-btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: var(--desert-red, #cd5c5c);
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: 600;
    transition: background-color 0.2s;
  }

  .login-btn:hover {
    background: #b84a4a;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .profile-header {
      flex-direction: column;
      text-align: center;
    }

    .detail-row {
      flex-direction: column;
      gap: 0.25rem;
      align-items: flex-start;
    }

    .detail-value {
      text-align: left;
    }
  }
</style>
