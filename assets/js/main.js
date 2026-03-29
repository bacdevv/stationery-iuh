(() => {
	const path = window.location.pathname;
	const isInPages = path.includes("/assets/pages/");
	const pagePrefix = isInPages ? "" : "./assets/pages/";
	const imgBase = isInPages ? "../img/" : "./assets/img/";
	const homeLink = isInPages ? "../../index.html" : "./index.html";

	const links = {
		home: homeLink,
		product: `${pagePrefix}product.html`,
		stationery: `${pagePrefix}stationery.html`,
		stationeryProduct: `${pagePrefix}stationery_product.html`,
		wishlist: `${pagePrefix}wishlist.html`,
		login: `${pagePrefix}login.html`,
		filledCart: `${pagePrefix}filled_cart.html`,
		emptyCart: `${pagePrefix}empty_cart.html`,
	};

	const productVariants = [
		{
			id: 1,
			name: "Brand Name - White Gel Pen, 0.5mm",
			img: `${imgBase}stationery-landing-page-white-pen.jpg`,
			price: "AED 2.00",
			prev: "AED 3.00",
			discount: "(33% off)",
			sku: "SKU: 8901425031926",
		},
		{
			id: 2,
			name: "Brand Name - Blue Ink Pen Set",
			img: `${imgBase}stationery-landing-page-blue-pen.jpg`,
			price: "AED 4.50",
			prev: "AED 6.00",
			discount: "(25% off)",
			sku: "SKU: 8901425031927",
		},
		{
			id: 3,
			name: "Brand Name - Dark Green Fine Liner",
			img: `${imgBase}stationery-landing-page-dark-green-pen.jpg`,
			price: "AED 3.20",
			prev: "AED 4.00",
			discount: "(20% off)",
			sku: "SKU: 8901425031928",
		},
		{
			id: 4,
			name: "Brand Name - Pink Marker",
			img: `${imgBase}stationery-landing-page-pink-pen.jpg`,
			price: "AED 5.10",
			prev: "AED 6.80",
			discount: "(25% off)",
			sku: "SKU: 8901425031929",
		},
	];

	const pickVariant = (id) => {
		const found = productVariants.find((item) => item.id === id);
		return found || productVariants[Math.floor(Math.random() * productVariants.length)];
	};

	const productLinkFor = (id) => `${links.product}?p=${id}`;

	const updateProductPage = () => {
		if (!path.endsWith("product.html")) {
			return;
		}
		const params = new URLSearchParams(window.location.search);
		const id = Number(params.get("p")) || 0;
		const variant = pickVariant(id);

		const productImage = document.querySelector(".product__gallery--img");
		const productName = document.querySelector(".content--product-name h2");
		const priceCurrent = document.querySelector(".product-price--current");
		const pricePrev = document.querySelector(".product-price--prev");
		const priceDiscount = document.querySelector(".product-price--discount-percent");
		const sku = document.querySelector(".content--product-code");

		if (productImage) {
			productImage.src = variant.img;
			productImage.alt = variant.name;
		}
		if (productName) {
			productName.textContent = variant.name;
		}
		if (priceCurrent) {
			priceCurrent.textContent = variant.price;
		}
		if (pricePrev) {
			pricePrev.textContent = variant.prev;
		}
		if (priceDiscount) {
			priceDiscount.textContent = variant.discount;
		}
		if (sku) {
			sku.textContent = variant.sku;
		}
	};

	const wireGlobalLinks = () => {
		document.querySelectorAll("a[href]").forEach((anchor) => {
			const raw = anchor.getAttribute("href") || "";
			if (raw.trim().startsWith("#!")) {
				const variant = pickVariant(0);
				anchor.href = productLinkFor(variant.id);
			}
		});

		const logo = document.querySelector(".logo");
		if (logo) {
			logo.addEventListener("click", () => {
				window.location.href = links.home;
			});
		}

		const headerIcons = document.querySelectorAll(".header__action-group img");
		if (headerIcons.length >= 3) {
			headerIcons[0].addEventListener("click", () => {
				window.location.href = links.stationeryProduct;
			});
			headerIcons[1].addEventListener("click", () => {
				window.location.href = links.login;
			});
			headerIcons[2].addEventListener("click", () => {
				window.location.href = links.wishlist;
			});
		}

		const cart = document.querySelector(".header__shopping-cart");
		if (cart) {
			cart.addEventListener("click", () => {
				window.location.href = links.filledCart;
			});
		}

		const cartBack = document.querySelector(".cart-back-link");
		if (cartBack) {
			cartBack.href = links.stationery;
		}
	};

	const initHeroSlider = () => {
		const slider = document.querySelector(".hero-slider");
		if (!slider) {
			return;
		}
		const slides = slider.querySelectorAll(".hero-slide");
		const dots = slider.querySelectorAll(".hero-dot");
		let activeIndex = 0;
		let timerId = null;

		const setActive = (index) => {
			slides.forEach((slide, idx) => {
				slide.classList.toggle("is-active", idx === index);
			});
			dots.forEach((dot, idx) => {
				dot.classList.toggle("is-active", idx === index);
			});
			activeIndex = index;
		};

		const nextSlide = () => {
			setActive((activeIndex + 1) % slides.length);
		};

		dots.forEach((dot) => {
			dot.addEventListener("click", () => {
				const index = Number(dot.dataset.slide);
				setActive(Number.isNaN(index) ? 0 : index);
				resetTimer();
			});
		});

		const resetTimer = () => {
			if (timerId) {
				clearInterval(timerId);
			}
			timerId = setInterval(nextSlide, 5000);
		};

		setActive(activeIndex);
		resetTimer();
	};

	const initReveal = () => {
		const revealTargets = document.querySelectorAll(
			".stationery__product__link, .stationery-product__list-item, .cart-item, .item__information, .st-product__item",
		);
		revealTargets.forEach((el) => el.classList.add("reveal"));

		if (!("IntersectionObserver" in window)) {
			revealTargets.forEach((el) => el.classList.add("is-visible"));
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.12 },
		);

		revealTargets.forEach((el) => observer.observe(el));
	};

	const init = () => {
		wireGlobalLinks();
		updateProductPage();
		initHeroSlider();
		initReveal();
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
