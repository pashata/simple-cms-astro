document.addEventListener('DOMContentLoaded', () => {
	const $body = document.body;
	const $wrapper = document.getElementById('wrapper');
	const $header = document.getElementById('header');
	const $banner = document.getElementById('banner');
	const $tiles = document.querySelectorAll('.tiles > article');
	const $menu = document.getElementById('menu');
 
	// Remove preload class after load
	window.addEventListener('load', () => {
		console.log('Page loaded');
	  setTimeout(() => $body.classList.remove('is-preload'), 100);
	});
  
	// Remove transitioning classes on unload/pagehide
	window.addEventListener('unload', () => {
	  setTimeout(() => {
		document.querySelectorAll('.is-transitioning').forEach(el => el.classList.remove('is-transitioning'));
	  }, 250);
	});

	window.addEventListener('pagehide', () => {
	  setTimeout(() => {
		document.querySelectorAll('.is-transitioning').forEach(el => el.classList.remove('is-transitioning'));
	  }, 250);
	});
  
	// Fix for IE/Edge
	if (navigator.userAgent.match(/(MSIE|Trident|Edge)/)) {
	  $body.classList.add('is-ie');
	}
  
	// Tiles logic
	$tiles.forEach($tile => {
	  const $image = $tile.querySelector('.image');
	  const $img = $image.querySelector('img');
	  const $link = $tile.querySelector('.link');
  
	  // Set background image
	  $tile.style.backgroundImage = `url('${$img.getAttribute('src')}')`;
  
	  // Set position if data-position exists
	  const position = $img.dataset.position;
	  if (position) {
		$image.style.backgroundPosition = position;
	  }
  
	  // Hide original image
	  $image.style.display = 'none';
  
	  // Clone link and append to tile
	  if ($link) {
		const $x = $link.cloneNode(true);
		$x.textContent = '';
		$x.classList.add('primary');
		$tile.appendChild($x);
  
		const links = [$link, $x];
		links.forEach(link => {
		  link.addEventListener('click', event => {
			event.preventDefault();
			event.stopPropagation();
			const href = link.getAttribute('href');
  
			if (link.getAttribute('target') === '_blank') {
			  window.open(href);
			} else {
			  $tile.classList.add('is-transitioning');
			  $wrapper.classList.add('is-transitioning');
			  setTimeout(() => {
				window.location.href = href;
			  }, 500);
			}
		  });
		});
	  }
	});
  
	// Parallax for banner
	if ($banner) {
	  const $image = $banner.querySelector('.image');
	  const $img = $image.querySelector('img');
	  if ($image) {
		$banner.style.backgroundImage = `url('${$img.getAttribute('src')}')`;
		$image.style.display = 'none';
	  }
  
	  // Basic parallax
	  const intensity = 0.275;
	  window.addEventListener('scroll', () => {
		const pos = window.scrollY - $banner.offsetTop;
		$banner.style.backgroundPosition = `center ${pos * (-1 * intensity)}px`;
	  });
	}
  
	// Header behavior
	if ($banner && $header.classList.contains('alt')) {
	  const headerHeight = $header.offsetHeight + 10;
  
	  const onScroll = () => {
		if (window.scrollY >= headerHeight) {
		  $header.classList.remove('alt');
		  $header.classList.add('reveal');
		} else {
		  $header.classList.add('alt');
		  $header.classList.remove('reveal');
		}
	  };
  
	  window.addEventListener('resize', onScroll);
	  window.addEventListener('load', () => {
		setTimeout(onScroll, 100);
	  });
	  window.addEventListener('scroll', onScroll);
	}
  
	// Menu logic
	if ($menu) {
	  const $menuInner = document.createElement('div');
	  $menuInner.classList.add('inner');
	  while ($menu.firstChild) {
		$menuInner.appendChild($menu.firstChild);
	  }
	  $menu.appendChild($menuInner);
  
	  let menuLocked = false;
  
	  const lockMenu = () => {
		if (menuLocked) return false;
		menuLocked = true;
		setTimeout(() => { menuLocked = false; }, 350);
		return true;
	  };
  
	  const showMenu = () => {
		if (lockMenu()) $body.classList.add('is-menu-visible');
	  };
  
	  const hideMenu = () => {
		if (lockMenu()) $body.classList.remove('is-menu-visible');
	  };
  
	  const toggleMenu = () => {
		if (lockMenu()) $body.classList.toggle('is-menu-visible');
	  };
  
	  $menuInner.addEventListener('click', e => e.stopPropagation());
	  $menuInner.querySelectorAll('a').forEach(a => {
		a.addEventListener('click', e => {
		  e.preventDefault();
		  e.stopPropagation();
		  hideMenu();
		  setTimeout(() => { window.location.href = a.getAttribute('href'); }, 250);
		});
	  });
  
	  $menu.addEventListener('click', e => {
		e.preventDefault();
		e.stopPropagation();
		hideMenu();
	  });
  
	  const closeBtn = document.createElement('a');
	  closeBtn.className = 'close';
	  closeBtn.href = '#menu';
	  closeBtn.textContent = 'Close';
	  $menu.appendChild(closeBtn);
  
	  document.querySelectorAll('a[href="#menu"]').forEach(a => {
		a.addEventListener('click', e => {
		  e.preventDefault();
		  e.stopPropagation();
		  toggleMenu();
		});
	  });
  
	  document.addEventListener('click', hideMenu);
	  document.addEventListener('keydown', e => {
		if (e.key === 'Escape') hideMenu();
	  });
	}
  });
  