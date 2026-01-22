// Benable Credibility Page - Application Logic

document.addEventListener('DOMContentLoaded', function() {
  initializePage();
});

function initializePage() {
  renderPublicView();
  renderOwnerInsights();
  initCarouselArrows();
}

// ============== CAROUSEL ARROW NAVIGATION ==============

function initCarouselArrows() {
  // Social Proof Carousel
  setupCarouselArrows(
    'socialCarouselContainer',
    'socialCarouselPrev',
    'socialCarouselNext',
    336 // card width + gap
  );

  // Benable Recommendations Carousel
  setupCarouselArrows(
    'recCarouselContainer',
    'recCarouselPrev',
    'recCarouselNext',
    316 // card width + gap
  );
}

function setupCarouselArrows(containerId, prevBtnId, nextBtnId, scrollAmount) {
  const container = document.getElementById(containerId);
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);

  if (!container || !prevBtn || !nextBtn) return;

  // Update arrow visibility based on scroll position
  function updateArrowVisibility() {
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    // Hide prev arrow at start
    if (scrollLeft <= 10) {
      prevBtn.classList.add('hidden');
    } else {
      prevBtn.classList.remove('hidden');
    }

    // Hide next arrow at end
    if (scrollLeft >= maxScroll - 10) {
      nextBtn.classList.add('hidden');
    } else {
      nextBtn.classList.remove('hidden');
    }
  }

  // Initial visibility check
  updateArrowVisibility();

  // Update on scroll
  container.addEventListener('scroll', updateArrowVisibility);

  // Update on resize
  window.addEventListener('resize', updateArrowVisibility);

  // Click handlers
  prevBtn.addEventListener('click', function() {
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', function() {
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });
}

// ============== VIEW TOGGLE ==============

function showPublicView() {
  document.getElementById('publicView').classList.remove('hidden');
  document.getElementById('ownerInsights').classList.remove('active');
  document.getElementById('publicViewBtn').classList.add('active');
  document.getElementById('ownerViewBtn').classList.remove('active');
}

function showOwnerInsights() {
  document.getElementById('publicView').classList.add('hidden');
  document.getElementById('ownerInsights').classList.add('active');
  document.getElementById('publicViewBtn').classList.remove('active');
  document.getElementById('ownerViewBtn').classList.add('active');
}

// Make toggle functions globally available
window.showPublicView = showPublicView;
window.showOwnerInsights = showOwnerInsights;

// ============== PUBLIC VIEW RENDERING ==============

function renderPublicView() {
  const data = businessData;

  // Header
  document.getElementById('businessName').textContent = data.business.name;
  document.getElementById('businessCategory').textContent = data.business.category;
  document.getElementById('businessLocation').textContent = `${data.business.city}, ${data.business.state}`;
  document.getElementById('overallRating').textContent = data.ratings.overallRating;
  document.getElementById('totalReviews').textContent = data.ratings.totalReviews;
  document.getElementById('badgeText').textContent = data.ratings.competitiveBadge;
  document.getElementById('aboutBusinessName').textContent = data.business.name;
  document.getElementById('businessDescription').textContent = data.business.description;
  document.getElementById('insightsBusinessName').textContent = data.business.name;

  // Stars
  renderStars('starsContainer', data.ratings.overallRating);

  // Business Links (condensed social icons)
  renderBusinessLinks(data.business);

  // Credentials (includes owner, team size, service area)
  renderCredentials(data.business);

  // Customer Insights (new insights-focused section)
  renderReviewSnapshot(data.reviewInsights.snapshot);
  renderCustomerInsights(data.reviewInsights.customerInsights);
  renderFeaturedReviews(data.reviewInsights.featuredGoogleReview, data.reviewInsights.recentReview);
  renderReviewPlatformLinks(data.reviewInsights.platformLinks);

  // Benable Themes (moved to top)
  renderKeywordTags('benableThemeTags', data.benableSentiment.topThemes);

  // Benable Recommendations with photos
  renderBenableRecommendations(data.benableRecommendations);

  // Social Proof (Instagram style)
  renderSocialProof(data.socialProof);

  // Press with logos
  renderPress(data.pressMembers);
}

function renderStars(containerId, rating) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    container.innerHTML += '<span class="star"><i class="fas fa-star"></i></span>';
  }
  if (hasHalfStar) {
    container.innerHTML += '<span class="star"><i class="fas fa-star-half-alt"></i></span>';
  }
  for (let i = 0; i < emptyStars; i++) {
    container.innerHTML += '<span class="star empty"><i class="fas fa-star"></i></span>';
  }
}

function renderBusinessLinks(business) {
  // Website link
  const websiteLink = document.getElementById('websiteLink');
  websiteLink.href = business.website;
  document.getElementById('websiteUrl').textContent = business.website.replace('https://', '');

  // Contact icons (phone & email)
  const contactIcons = document.getElementById('contactIcons');
  contactIcons.innerHTML = `
    <a href="tel:${business.phone.replace(/[^0-9]/g, '')}" class="contact-icon-link phone" title="Call ${business.phone}">
      <i class="fas fa-phone"></i>
    </a>
    <a href="mailto:${business.email}" class="contact-icon-link email" title="Email ${business.email}">
      <i class="fas fa-envelope"></i>
    </a>
  `;

  // Social icons
  const socialIcons = document.getElementById('socialIcons');
  const allLinks = [
    { platform: 'instagram', url: business.socialMedia.instagram, icon: 'fab fa-instagram' },
    { platform: 'facebook', url: business.socialMedia.facebook, icon: 'fab fa-facebook-f' },
    { platform: 'tiktok', url: business.socialMedia.tiktok, icon: 'fab fa-tiktok' },
    { platform: 'google', url: business.reviewPlatforms.google, icon: 'fab fa-google' },
    { platform: 'yelp', url: business.reviewPlatforms.yelp, icon: 'fab fa-yelp' },
    { platform: 'theknot', url: business.reviewPlatforms.theknot, icon: 'fas fa-ring' }
  ];

  socialIcons.innerHTML = allLinks.map(link => `
    <a href="${link.url}" target="_blank" class="social-icon-link ${link.platform}" title="${capitalize(link.platform)}">
      <i class="${link.icon}"></i>
    </a>
  `).join('');
}

function renderCredentials(business) {
  const grid = document.getElementById('credentialsGrid');
  const credentials = business.credentials;

  // Format awards as hyperlinks
  const awardsHtml = credentials.awards.map(award =>
    `<a href="${award.url}" target="_blank" class="credential-link">${award.name} (${award.source})</a>`
  ).join(', ');

  // Format affiliations as hyperlinks
  const affiliationsHtml = credentials.affiliations.map(aff =>
    `<a href="${aff.url}" target="_blank" class="credential-link">${aff.name}</a>`
  ).join(', ');

  grid.innerHTML = `
    <div class="credential-item credential-item-owner">
      <img src="${business.owner.photo}" alt="${business.owner.name}" class="owner-photo">
      <div class="credential-content">
        <h4>Owner</h4>
        <p>${business.owner.name}</p>
      </div>
    </div>
    <div class="credential-item">
      <div class="credential-icon"><i class="fas fa-calendar-check"></i></div>
      <div class="credential-content">
        <h4>Years in Business</h4>
        <p>${credentials.yearsInBusiness} years</p>
      </div>
    </div>
    <div class="credential-item">
      <div class="credential-icon"><i class="fas fa-user-group"></i></div>
      <div class="credential-content">
        <h4>Team Size</h4>
        <p>${business.teamSize}</p>
      </div>
    </div>
    <div class="credential-item">
      <div class="credential-icon"><i class="fas fa-map-marker-alt"></i></div>
      <div class="credential-content">
        <h4>Service Area</h4>
        <p>${business.serviceArea}</p>
      </div>
    </div>
    <div class="credential-item">
      <div class="credential-icon"><i class="fas fa-id-card"></i></div>
      <div class="credential-content">
        <h4>Licenses</h4>
        <p>${credentials.licenses}</p>
      </div>
    </div>
    <div class="credential-item">
      <div class="credential-icon"><i class="fas fa-award"></i></div>
      <div class="credential-content">
        <h4>Awards</h4>
        <p>${awardsHtml}</p>
      </div>
    </div>
    <div class="credential-item">
      <div class="credential-icon"><i class="fas fa-handshake"></i></div>
      <div class="credential-content">
        <h4>Affiliations</h4>
        <p>${affiliationsHtml}</p>
      </div>
    </div>
  `;
}

function renderKeywordTags(containerId, keywords) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = keywords.map(keyword =>
    `<span class="keyword-tag">${keyword}</span>`
  ).join('');
}

function renderReviewSnapshot(snapshot) {
  const container = document.getElementById('reviewSnapshot');
  if (!container) return;

  const velocityChange = snapshot.reviewVelocity.current - snapshot.reviewVelocity.previous;
  const velocityText = velocityChange > 0 ? `+${velocityChange} from last month` : `${velocityChange} from last month`;

  container.innerHTML = `
    <div class="snapshot-item">
      <div class="snapshot-value">
        ${snapshot.overallRating}
        <div class="stars">${generateStarsHTML(Math.round(snapshot.overallRating))}</div>
      </div>
      <div class="snapshot-label">Overall Rating</div>
      <div class="snapshot-detail">${snapshot.totalReviews} reviews across ${snapshot.platforms}</div>
    </div>
    <div class="snapshot-item">
      <div class="snapshot-value">
        ${snapshot.reviewVelocity.current}
        <span class="velocity-up"><i class="fas fa-arrow-trend-up"></i></span>
      </div>
      <div class="snapshot-label">New Reviews</div>
      <div class="snapshot-detail">Past ${snapshot.reviewVelocity.period} (${velocityText})</div>
    </div>
    <div class="snapshot-item">
      <div class="snapshot-value">${snapshot.responseRate}%</div>
      <div class="snapshot-label">Response Rate</div>
      <div class="snapshot-detail">Owner replies to reviews</div>
    </div>
  `;
}

function renderCustomerInsights(insights) {
  const container = document.getElementById('customerInsightsList');
  if (!container) return;

  // Only show first 3 insights, and only show quote for the first one
  const limitedInsights = insights.slice(0, 3);

  container.innerHTML = limitedInsights.map((insight, index) => `
    <div class="insight-item">
      <div class="insight-header">
        <span class="insight-theme">${insight.theme}</span>
        <span class="insight-percentage">${insight.percentage}% mention this</span>
      </div>
      <p class="insight-description">${insight.description}</p>
      ${index === 0 ? `
      <div class="insight-quote">
        <span class="insight-quote-icon"><i class="fas fa-quote-left"></i></span>
        <div>
          <p class="insight-quote-text">"${insight.representativeQuote.text}"</p>
          <div class="insight-quote-author">— ${insight.representativeQuote.author}</div>
        </div>
      </div>
      ` : ''}
    </div>
  `).join('');
}

function renderFeaturedReviews(featuredReview, recentReview) {
  const container = document.getElementById('featuredReviewsGrid');
  if (!container) return;

  container.innerHTML = `
    <div class="review-embed-card">
      <div class="review-embed-header">
        <svg class="google-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span class="review-embed-title">Featured Review</span>
      </div>
      <div class="review-embed-content">
        <div class="review-embed-reviewer">
          <img src="${featuredReview.reviewerAvatar}" alt="${featuredReview.reviewerName}" class="review-embed-avatar">
          <div class="review-embed-info">
            <div class="review-embed-name">${featuredReview.reviewerName}</div>
            <div class="review-embed-meta">
              <div class="review-embed-stars">
                ${generateStarsHTML(featuredReview.rating)}
              </div>
              <span class="review-embed-date">${formatDate(featuredReview.date)}</span>
            </div>
          </div>
        </div>
        <p class="review-embed-text">"${featuredReview.text}"</p>
      </div>
    </div>
    <div class="review-embed-card">
      <div class="review-embed-header">
        <svg class="google-logo" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span class="review-embed-title">Recent Review</span>
      </div>
      <div class="review-embed-content">
        <div class="review-embed-reviewer">
          <img src="${recentReview.reviewerAvatar}" alt="${recentReview.reviewerName}" class="review-embed-avatar">
          <div class="review-embed-info">
            <div class="review-embed-name">${recentReview.reviewerName}</div>
            <div class="review-embed-meta">
              <div class="review-embed-stars">
                ${generateStarsHTML(recentReview.rating)}
              </div>
              <span class="review-embed-date">${recentReview.date}</span>
            </div>
          </div>
        </div>
        <p class="review-embed-text">"${recentReview.text}"</p>
      </div>
    </div>
  `;
}

function renderReviewPlatformLinks(platformLinks) {
  const container = document.getElementById('reviewPlatformLinks');
  if (!container) return;

  container.innerHTML = `
    <span class="platform-links-label">See all reviews on</span>
    <div class="platform-links-row">
      <a href="${platformLinks.google}" target="_blank" class="platform-link google">
        <i class="fab fa-google"></i>
        <span>Google</span>
      </a>
      <a href="${platformLinks.theknot}" target="_blank" class="platform-link theknot">
        <i class="fas fa-ring"></i>
        <span>The Knot</span>
      </a>
      <a href="${platformLinks.yelp}" target="_blank" class="platform-link yelp">
        <i class="fab fa-yelp"></i>
        <span>Yelp</span>
      </a>
    </div>
  `;
}

function generateStarsHTML(rating) {
  let html = '';
  for (let i = 0; i < rating; i++) {
    html += '<span class="star"><i class="fas fa-star"></i></span>';
  }
  for (let i = rating; i < 5; i++) {
    html += '<span class="star empty"><i class="fas fa-star"></i></span>';
  }
  return html;
}

function renderBenableRecommendations(recommendations) {
  const carousel = document.getElementById('recCarousel');
  if (!carousel) return;

  // Sample photos for the rec cards
  const recPhotos = [
    'images/rec-photo-1.jpg',
    'images/rec-photo-2.jpg',
    'images/rec-photo-3.jpg',
    'images/rec-photo-4.jpg',
    'images/rec-photo-5.jpg'
  ];

  const cardsHtml = recommendations.map((rec, index) => `
    <div class="rec-card">
      <div class="rec-card-header">
        <i class="far fa-list-alt"></i>
        <span class="rec-list-name">${rec.listName}</span>
      </div>
      <div class="rec-card-image">
        <img src="${recPhotos[index % recPhotos.length]}" alt="${rec.recTitle}" class="rec-photo">
      </div>
      <div class="rec-card-content">
        <h4 class="rec-title">${rec.recTitle}</h4>
        <div class="rec-note-row">
          <img src="${rec.recommenderAvatar}" alt="${rec.recommenderName}" class="rec-avatar">
          <p class="rec-note">${rec.note}</p>
        </div>
        <div class="rec-actions">
          <div class="rec-action">
            <i class="far fa-heart"></i>
            <span>${formatCount(rec.likes)}</span>
          </div>
          <div class="rec-action">
            <i class="far fa-comment"></i>
            <span>${formatCount(rec.comments)}</span>
          </div>
          <div class="rec-action-spacer"></div>
          <div class="rec-action">
            <i class="fas fa-arrow-up-from-bracket"></i>
          </div>
          <div class="rec-action">
            <i class="far fa-bookmark"></i>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Add "View more" card at the end
  const viewMoreCard = `
    <a href="https://benable.com/bellavistaphoto" target="_blank" class="rec-card rec-card-view-more">
      <div class="view-more-content">
        <div class="view-more-icon">
          <i class="fas fa-arrow-right"></i>
        </div>
        <span>View more on Benable</span>
      </div>
    </a>
  `;

  carousel.innerHTML = cardsHtml + viewMoreCard;
}

function formatCount(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return count.toString();
}

function renderSocialProof(socialProof) {
  const section = document.getElementById('socialProofSection');
  const list = document.getElementById('socialProofList');

  if (!socialProof || socialProof.length === 0) {
    section.style.display = 'none';
    return;
  }

  const embedsHtml = socialProof.map(proof => {
    const isInstagram = proof.platform === 'Instagram';
    const isTikTok = proof.platform === 'TikTok';

    if (isInstagram) {
      return renderInstagramEmbed(proof);
    } else if (isTikTok) {
      return renderTikTokEmbed(proof);
    }
    return '';
  }).join('');

  // Add "View more" card at the end
  const viewMoreCard = `
    <a href="https://instagram.com/bellavistaphoto" target="_blank" class="social-embed-view-more">
      <div class="view-more-content">
        <div class="view-more-icon">
          <i class="fas fa-arrow-right"></i>
        </div>
        <span>View more mentions</span>
      </div>
    </a>
  `;

  list.innerHTML = embedsHtml + viewMoreCard;
}

function renderInstagramEmbed(proof) {
  // Generate photo carousel HTML
  const photosHtml = proof.photos && proof.photos.length > 0
    ? proof.photos.map((photo, index) => `
        <div class="photo-carousel-item">
          <img src="${photo}" alt="Photo ${index + 1}" onerror="this.parentElement.innerHTML='<div class=\\'photo-carousel-placeholder\\'><i class=\\'fab fa-instagram\\'></i></div>'">
        </div>
      `).join('')
    : `<div class="photo-carousel-item"><div class="photo-carousel-placeholder"><i class="fab fa-instagram"></i></div></div>`;

  const dotsHtml = proof.photos && proof.photos.length > 1
    ? `<div class="carousel-dots">
        ${proof.photos.map((_, index) => `<span class="carousel-dot ${index === 0 ? 'active' : ''}"></span>`).join('')}
       </div>`
    : '';

  const indicatorHtml = proof.photos && proof.photos.length > 1
    ? `<span class="carousel-indicator">1/${proof.photos.length}</span>`
    : '';

  return `
    <div class="social-embed instagram">
      <div class="social-embed-header">
        <div class="social-embed-user">
          <img src="${proof.avatar}" alt="${proof.creatorName}" class="social-embed-avatar">
          <div class="social-embed-user-info">
            <div class="social-embed-username">
              ${proof.username}
              ${proof.verified ? '<i class="fas fa-check-circle social-embed-verified"></i>' : ''}
            </div>
            <div class="social-embed-meta">${formatFollowers(proof.followerCount)} followers</div>
          </div>
        </div>
        <div class="social-embed-platform" style="color: #E4405F">
          <i class="fab fa-instagram"></i>
        </div>
      </div>
      <div class="social-embed-photos">
        <div class="photo-carousel">
          ${photosHtml}
        </div>
        ${dotsHtml}
        ${indicatorHtml}
      </div>
      <div class="social-embed-content">
        <div class="social-embed-actions">
          <div class="social-embed-action">
            <i class="far fa-heart"></i>
            <span>${formatCount(proof.likes)}</span>
          </div>
          <div class="social-embed-action">
            <i class="far fa-comment"></i>
            <span>${formatCount(proof.comments)}</span>
          </div>
          <div class="social-embed-action">
            <i class="far fa-paper-plane"></i>
          </div>
          <div class="social-embed-action-right">
            <i class="far fa-bookmark"></i>
          </div>
        </div>
        <p class="social-embed-caption">
          <strong>${proof.username}</strong> ${proof.caption}
        </p>
      </div>
      <a href="${proof.postLink}" target="_blank" class="social-embed-link">
        <i class="fab fa-instagram"></i>
        View on Instagram
      </a>
    </div>
  `;
}

function renderTikTokEmbed(proof) {
  const thumbnailHtml = proof.thumbnail
    ? `<img src="${proof.thumbnail}" alt="Video thumbnail" class="tiktok-thumbnail" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
       <div class="tiktok-thumbnail-placeholder" style="display: none;"></div>`
    : `<div class="tiktok-thumbnail-placeholder"></div>`;

  return `
    <div class="social-embed tiktok">
      <div class="social-embed-header">
        <div class="social-embed-user">
          <img src="${proof.avatar}" alt="${proof.creatorName}" class="social-embed-avatar">
          <div class="social-embed-user-info">
            <div class="social-embed-username">
              ${proof.username}
              ${proof.verified ? '<i class="fas fa-check-circle social-embed-verified" style="color: #20D5EC;"></i>' : ''}
            </div>
            <div class="social-embed-meta">${formatFollowers(proof.followerCount)} followers</div>
          </div>
        </div>
        <div class="social-embed-platform" style="color: #fff">
          <i class="fab fa-tiktok"></i>
        </div>
      </div>
      <div class="tiktok-video-container">
        ${thumbnailHtml}
        <div class="tiktok-play-overlay">
          <i class="fas fa-play"></i>
        </div>
        <div class="tiktok-sidebar">
          <div class="tiktok-sidebar-action">
            <i class="fas fa-heart"></i>
            <span>${formatCount(proof.likes)}</span>
          </div>
          <div class="tiktok-sidebar-action">
            <i class="fas fa-comment-dots"></i>
            <span>${formatCount(proof.comments)}</span>
          </div>
          <div class="tiktok-sidebar-action">
            <i class="fas fa-share"></i>
            <span>Share</span>
          </div>
          <div class="tiktok-music-disc">
            <i class="fas fa-music"></i>
          </div>
        </div>
      </div>
      <div class="social-embed-content">
        <p class="social-embed-caption">
          <strong>@${proof.username}</strong> ${proof.caption}
        </p>
      </div>
      <a href="${proof.postLink}" target="_blank" class="social-embed-link">
        <i class="fab fa-tiktok"></i>
        View on TikTok
      </a>
    </div>
  `;
}

function renderPress(pressItems) {
  const section = document.getElementById('pressSection');
  const list = document.getElementById('pressList');

  if (!pressItems || pressItems.length === 0) {
    section.style.display = 'none';
    return;
  }

  const logoMap = {
    'Austin Monthly Magazine': 'images/austin-monthly-logo.svg',
    'Texas Weddings Blog': 'images/texas-weddings-logo.svg'
  };

  list.innerHTML = pressItems.map(item => `
    <a href="${item.url}" target="_blank" class="press-item">
      <div class="press-logo">
        <img src="${logoMap[item.publication] || ''}" alt="${item.publication}">
      </div>
      <div class="press-content">
        <span class="press-headline">${item.headline}</span>
        <span>${formatDate(item.date)}</span>
      </div>
      <div class="press-arrow">
        <i class="fas fa-arrow-right"></i>
      </div>
    </a>
  `).join('');
}

// ============== OWNER INSIGHTS RENDERING ==============

function renderOwnerInsights() {
  const insights = businessData.ownerInsights;

  renderMetrics(insights.analytics);
  renderSentiment(insights.sentimentSummary);
  renderSeoScore(insights.seoAeoScore);
  renderIssues(insights.negativeReviewExamples);
  renderRecommendations(insights.recommendations);
  renderVisibilityGaps(insights.visibilityGaps);
}

function renderMetrics(analytics) {
  const grid = document.getElementById('metricsGrid');
  grid.innerHTML = `
    <div class="metric-card">
      <div class="metric-value">${analytics.pageViews30Days}</div>
      <div class="metric-label">Page Views</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">${analytics.totalClicks}</div>
      <div class="metric-label">Total Clicks</div>
    </div>
    <div class="metric-card">
      <div class="metric-value">${analytics.clickThroughRate}%</div>
      <div class="metric-label">Click-Through Rate</div>
    </div>
  `;

  const breakdown = document.getElementById('clickBreakdown');
  breakdown.innerHTML = `
    <h4>Click Breakdown</h4>
    <div class="breakdown-item">
      <span>Website Clicks</span>
      <span>${analytics.websiteClicks}</span>
    </div>
    <div class="breakdown-item">
      <span>Phone Clicks</span>
      <span>${analytics.phoneClicks}</span>
    </div>
    <div class="breakdown-item">
      <span>Review Platform Clicks</span>
      <span>${analytics.reviewPlatformClicks}</span>
    </div>
  `;
}

function renderSentiment(sentiment) {
  const header = document.getElementById('sentimentHeader');
  const sentimentClass = sentiment.overall.toLowerCase();
  const trendClass = sentiment.trend.toLowerCase();
  const trendIcon = getTrendIcon(sentiment.trend);

  header.innerHTML = `
    <span class="sentiment-badge ${sentimentClass}">
      <i class="fas fa-${sentimentClass === 'positive' ? 'smile' : sentimentClass === 'negative' ? 'frown' : 'meh'}"></i>
      ${sentiment.overall}
    </span>
    <span class="trend-indicator ${trendClass}">
      ${trendIcon} ${sentiment.trend}
    </span>
  `;

  const columns = document.getElementById('sentimentColumns');
  columns.innerHTML = `
    <div class="sentiment-column positive">
      <h4><i class="fas fa-thumbs-up"></i> Top Positive Themes</h4>
      <ul>
        ${sentiment.topPositiveThemes.map(theme => `<li>${theme}</li>`).join('')}
      </ul>
    </div>
    <div class="sentiment-column concerns">
      <h4><i class="fas fa-exclamation-circle"></i> Top Concerns</h4>
      <ul>
        ${sentiment.topConcerns.map(concern => `<li>${concern}</li>`).join('')}
      </ul>
    </div>
  `;
}

function getTrendIcon(trend) {
  const icons = {
    'Improving': '<i class="fas fa-arrow-up"></i>',
    'Stable': '<i class="fas fa-minus"></i>',
    'Declining': '<i class="fas fa-arrow-down"></i>'
  };
  return icons[trend] || '';
}

function renderSeoScore(seoData) {
  const scoreDisplay = document.getElementById('seoScoreDisplay');
  scoreDisplay.innerHTML = `
    <div class="score-circle" style="--score: ${seoData.score}">
      <span class="score-value">${seoData.score}</span>
    </div>
    <div class="score-info">
      <span class="score-label">SEO & AI Visibility Score out of 100</span>
    </div>
  `;

  const tables = document.getElementById('seoTables');
  tables.innerHTML = `
    <div class="seo-table">
      <h4>Google Rankings</h4>
      <table>
        <thead>
          <tr>
            <th>Keyword</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          ${seoData.rankings.map(rank => `
            <tr>
              <td>${rank.keyword}</td>
              <td><span class="position-badge ${getPositionClass(rank.position)}">#${rank.position}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div class="seo-table">
      <h4>AI Engine Visibility</h4>
      <table>
        <thead>
          <tr>
            <th>Engine</th>
            <th>Status</th>
            <th>Position</th>
          </tr>
        </thead>
        <tbody>
          ${seoData.aiVisibility.map(ai => `
            <tr>
              <td>${ai.engine}</td>
              <td><span class="status-badge ${ai.appears ? 'appears' : 'not-found'}">${ai.appears ? 'Appears' : 'Not Found'}</span></td>
              <td>${ai.position ? `<span class="position-badge ${getPositionClass(ai.position)}">#${ai.position}</span>` : '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function getPositionClass(position) {
  if (position <= 3) return 'top-3';
  if (position <= 10) return 'top-10';
  return 'other';
}

function renderIssues(issues) {
  const list = document.getElementById('issuesList');
  list.innerHTML = issues.map(issue => `
    <div class="issue-card">
      <div class="issue-header">
        <div class="issue-meta">
          <span>${issue.reviewerName}</span>
          <span>&bull;</span>
          <span>${issue.platform}</span>
          <span>&bull;</span>
          <span>${formatDate(issue.date)}</span>
        </div>
        <span class="response-status ${issue.status === 'Responded' ? 'responded' : 'not-responded'}">
          ${issue.status}
        </span>
      </div>
      <p class="issue-excerpt">"${issue.excerpt}"</p>
      <div class="issue-summary">
        <span>Issue:</span>
        <span class="issue-tag">${issue.issue}</span>
      </div>
    </div>
  `).join('');
}

function renderRecommendations(recommendations) {
  const list = document.getElementById('recommendationsList');
  list.innerHTML = recommendations.map(rec => `
    <div class="recommendation-item">
      <span class="priority-badge ${rec.priority.toLowerCase()}">${rec.priority}</span>
      <div class="recommendation-content">
        <h4>${rec.action}</h4>
        <p>${rec.reason}</p>
      </div>
    </div>
  `).join('');
}

function renderVisibilityGaps(gaps) {
  const content = document.getElementById('visibilityContent');
  content.innerHTML = `
    <div class="visibility-column">
      <h4>Missing Platforms</h4>
      <div class="platform-tags">
        ${gaps.missingPlatforms.map(p => `<span class="platform-tag missing"><i class="fas fa-times-circle"></i> ${p}</span>`).join('')}
      </div>
    </div>
    <div class="visibility-column">
      <h4>Weak Presence</h4>
      <div class="platform-tags">
        ${gaps.weakPresence.map(p => `<span class="platform-tag weak"><i class="fas fa-exclamation-circle"></i> ${p}</span>`).join('')}
      </div>
    </div>
  `;

  const callout = document.getElementById('opportunityCallout');
  callout.innerHTML = `
    <div class="opportunity-icon"><i class="fas fa-lightbulb"></i></div>
    <p><strong>Opportunity:</strong> ${gaps.opportunity}</p>
  `;
}

// ============== UTILITY FUNCTIONS ==============

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatFollowers(count) {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
}
