// Benable Credibility Page - Application Logic

document.addEventListener('DOMContentLoaded', function() {
  initializePage();
});

function initializePage() {
  renderPublicView();
  renderOwnerInsights();
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

  // Credentials
  renderCredentials(data.business.credentials);

  // Review Keywords (moved to top)
  renderKeywordTags('reviewKeywordTags', data.reviewSentiment.topKeywords);

  // Reviews with avatars
  renderReviews(data.featuredReviews);

  // Benable Themes (moved to top)
  renderKeywordTags('benableThemeTags', data.benableSentiment.topThemes);

  // Benable Recommendations with photos
  renderBenableRecommendations(data.benableRecommendations);

  // Social Proof (Instagram style)
  renderSocialProof(data.socialProof);

  // Press with logos
  renderPress(data.pressMembers);

  // Contact
  renderContact(data.business);
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

function renderCredentials(credentials) {
  const grid = document.getElementById('credentialsGrid');
  grid.innerHTML = `
    <div class="credential-item">
      <div class="credential-icon"><i class="fas fa-calendar-check"></i></div>
      <div class="credential-content">
        <h4>Years in Business</h4>
        <p>${credentials.yearsInBusiness} years</p>
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
        <p>${credentials.awards}</p>
      </div>
    </div>
    <div class="credential-item">
      <div class="credential-icon"><i class="fas fa-users"></i></div>
      <div class="credential-content">
        <h4>Affiliations</h4>
        <p>${credentials.affiliations}</p>
      </div>
    </div>
  `;
}

function renderKeywordTags(containerId, keywords) {
  const container = document.getElementById(containerId);
  container.innerHTML = keywords.map(keyword =>
    `<span class="keyword-tag">${keyword}</span>`
  ).join('');
}

function renderReviews(reviews) {
  const avatarImages = ['images/reviewer-1.jpg', 'images/reviewer-2.jpg', 'images/reviewer-3.jpg'];
  const list = document.getElementById('reviewsList');

  list.innerHTML = reviews.map((review, index) => `
    <div class="review-card">
      <div class="review-header">
        <img src="${avatarImages[index]}" alt="${review.reviewerName}" class="reviewer-avatar">
        <div class="reviewer-info">
          <div class="reviewer-name">${review.reviewerName}</div>
          <div class="review-meta">
            <div class="review-stars">
              ${generateStarsHTML(review.rating)}
            </div>
            <span class="review-platform-badge ${review.platform.toLowerCase().replace(' ', '')}">${review.platform}</span>
            <span class="review-date">${formatDate(review.date)}</span>
          </div>
        </div>
      </div>
      <p class="review-text">"${review.text}"</p>
    </div>
  `).join('');
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
  const avatarImages = ['images/benable-1.jpg', 'images/benable-2.jpg', 'images/benable-3.jpg'];
  const list = document.getElementById('benableRecommendationsList');

  list.innerHTML = recommendations.map((rec, index) => `
    <div class="recommendation-card">
      <div class="recommender-info">
        <img src="${avatarImages[index]}" alt="${rec.recommenderName}" class="recommender-avatar">
        <div class="recommender-details">
          <h4>${rec.recommenderName}</h4>
          <a href="${rec.profileLink}" target="_blank" class="benable-link">
            View on Benable <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
      </div>
      <p class="recommendation-text">"${rec.note}"</p>
    </div>
  `).join('');
}

function renderSocialProof(socialProof) {
  const section = document.getElementById('socialProofSection');
  const list = document.getElementById('socialProofList');

  if (!socialProof || socialProof.length === 0) {
    section.style.display = 'none';
    return;
  }

  const proof = socialProof[0];

  list.innerHTML = `
    <div class="instagram-post">
      <div class="instagram-header">
        <div class="instagram-user">
          <img src="images/influencer-1.jpg" alt="${proof.creatorName}" class="instagram-avatar">
          <div>
            <div class="instagram-username">
              ${proof.creatorName.toLowerCase().replace(/\s+/g, '')}
              <i class="fas fa-check-circle instagram-verified"></i>
            </div>
            <div class="instagram-followers">${formatFollowers(proof.followerCount)} followers</div>
          </div>
        </div>
        <div class="instagram-more">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>
      <div class="instagram-content">
        <p class="instagram-caption">
          <strong>${proof.creatorName.toLowerCase().replace(/\s+/g, '')}</strong> ${proof.quote}
        </p>
        <div class="instagram-actions">
          <div class="instagram-action liked">
            <i class="fas fa-heart"></i>
            <span>2,847</span>
          </div>
          <div class="instagram-action">
            <i class="far fa-comment"></i>
            <span>143</span>
          </div>
          <div class="instagram-action">
            <i class="far fa-paper-plane"></i>
          </div>
        </div>
      </div>
      <a href="${proof.postLink}" target="_blank" class="instagram-link">
        <i class="fab fa-instagram"></i>
        View on Instagram
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

function renderContact(business) {
  const container = document.getElementById('contactMethods');
  container.innerHTML = `
    <a href="tel:${business.phone.replace(/[^0-9]/g, '')}" class="contact-item">
      <div class="contact-icon"><i class="fas fa-phone"></i></div>
      <div class="contact-details">
        <h4>Phone</h4>
        <p>${business.phone}</p>
      </div>
    </a>
    <a href="mailto:${business.email}" class="contact-item">
      <div class="contact-icon"><i class="fas fa-envelope"></i></div>
      <div class="contact-details">
        <h4>Email</h4>
        <p>${business.email}</p>
      </div>
    </a>
    <a href="${business.website}" target="_blank" class="contact-item">
      <div class="contact-icon"><i class="fas fa-globe"></i></div>
      <div class="contact-details">
        <h4>Website</h4>
        <p>${business.website.replace('https://', '')}</p>
      </div>
    </a>
  `;
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
