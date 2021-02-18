---
layout: null
---
window.simpleJekyllSearch = new SimpleJekyllSearch({
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('search-results'),
    json: '{{ site.baseurl }}/search.json',
    searchResultTemplate: '<li><span class="post-meta"><time class="published" datetime="{date}">{date}</time></span><a href="{url}" title="{desc}">{title}</a> </li>',
    noResultsText: 'No results found',
    limit: 15,
    fuzzy: false,
    exclude: ['Welcome']
})
