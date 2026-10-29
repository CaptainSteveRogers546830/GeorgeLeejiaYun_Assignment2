// AZoom Car Rental: one script for every page.
// Each section only runs on the page that has its elements, so there are no errors elsewhere.

// ======================================================================
// SHARED: booking data (My Trips and Employee both use it)
// ======================================================================

// Shared booking data for the My Trips and Employee pages.
// There is no back end, so bookings live in this file's sample data and are saved in the browser
// (localStorage). That is how a change made on one page shows up on the other.

const AZoomBookings = (() => {
  const STORAGE_KEY = "azoomBookings2";

  const seed = [
    { ref: "AZ7K29D4", customer: "John Tan", email: "john@example.com", carName: "Tesla Model 3", dailyRate: 99,
      pickupDate: "2026-10-19", returnDate: "2026-10-23", pickupBranch: "Toa Payoh",
      status: "active", returnCarPark: null, damage: { amount: 0, note: "" }, inspectedBy: null, paidOn: null },
    { ref: "AZ3M81QX", customer: "John Tan", email: "john@example.com", carName: "Hyundai Kona Electric", dailyRate: 65,
      pickupDate: "2026-10-10", returnDate: "2026-10-13", pickupBranch: "Orchard Road",
      status: "inspected", returnCarPark: "Orchard Road Car Park", damage: { amount: 85, note: "scratch on rear bumper" }, inspectedBy: "Alice Chen", paidOn: null },
    { ref: "AZ9P40LB", customer: "John Tan", email: "john@example.com", carName: "Nissan Leaf", dailyRate: 39,
      pickupDate: "2026-10-01", returnDate: "2026-10-03", pickupBranch: "Toa Payoh",
      status: "paid", returnCarPark: "Toa Payoh Car Park", damage: { amount: 0, note: "" }, inspectedBy: "Ben Ong", paidOn: "2026-10-04" },
    { ref: "AZ5T66HN", customer: "John Tan", email: "john@example.com", carName: "BYD Dolphin", dailyRate: 45,
      pickupDate: "2026-10-25", returnDate: "2026-10-28", pickupBranch: "Changi",
      status: "reserved", returnCarPark: null, damage: { amount: 0, note: "" }, inspectedBy: null, paidOn: null },
    { ref: "AZ2B77KD", customer: "Maya Lim", email: "maya@example.com", carName: "Tesla Model Y", dailyRate: 119,
      pickupDate: "2026-10-24", returnDate: "2026-10-26", pickupBranch: "Jurong East",
      status: "reserved", returnCarPark: null, damage: { amount: 0, note: "" }, inspectedBy: null, paidOn: null },
    { ref: "AZ8C15WM", customer: "Daniel Ong", email: "daniel@example.com", carName: "MG MG4 Electric", dailyRate: 49,
      pickupDate: "2026-10-18", returnDate: "2026-10-22", pickupBranch: "Woodlands",
      status: "active", returnCarPark: null, damage: { amount: 0, note: "" }, inspectedBy: null, paidOn: null },
    { ref: "AZ4R93ZP", customer: "Priya Nair", email: "priya@example.com", carName: "Hyundai Ioniq 6", dailyRate: 79,
      pickupDate: "2026-10-15", returnDate: "2026-10-18", pickupBranch: "Toa Payoh",
      status: "returned", returnCarPark: "HarbourFront Car Park", damage: { amount: 0, note: "" }, inspectedBy: null, paidOn: null },
    { ref: "AZ6V20TE", customer: "Wei Ling Koh", email: "weiling@example.com", carName: "Mercedes-Benz EQS", dailyRate: 189,
      pickupDate: "2026-10-05", returnDate: "2026-10-08", pickupBranch: "Orchard Road",
      status: "paid", returnCarPark: "Orchard Road Car Park", damage: { amount: 120, note: "cracked wing mirror" }, inspectedBy: "Chloe Wong", paidOn: "2026-10-09" }
  ];

  const copySeed = () => JSON.parse(JSON.stringify(seed));

  const save = (bookings) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings)); } catch (error) { /* storage unavailable */ }
  };

  const load = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const bookings = JSON.parse(saved);

        // Bookings saved by an older version of the page may lack some fields: fill them in
        bookings.forEach((booking) => {
          const sample = seed.find((item) => item.ref === booking.ref);
          if (!booking.customer) booking.customer = sample ? sample.customer : "Customer";
          if (!("inspectedBy" in booking)) booking.inspectedBy = sample ? sample.inspectedBy : null;
        });

        // Add any sample bookings that are not saved yet
        copySeed().forEach((sample) => {
          if (!bookings.some((booking) => booking.ref === sample.ref)) bookings.push(sample);
        });
        return bookings;
      }
    } catch (error) { /* fall back to the sample data */ }
    return copySeed();
  };

  const reset = () => {
    const fresh = copySeed();
    save(fresh);
    return fresh;
  };

  return { load, save, reset };
})();

// ======================================================================
// SHARED: the cars (Fleet, Booking and Employee pages all use this list)
// ======================================================================

// Placeholder data: change names, prices and ratings as you like.
// isAvailable: false means the car is out on rental right now.
const AZOOM_CARS = [
  { id: "C001", make: "Nissan",        model: "Leaf",          category: "Hatchback", seats: 5, transmission: "Automatic", rangeKm: 270, dailyRate: 39,  rating: 4.3, isAvailable: true,  imageUrl: "images/Nissan Leaf.jpg" },
  { id: "C002", make: "BYD",           model: "Dolphin",       category: "Hatchback", seats: 5, transmission: "Automatic", rangeKm: 340, dailyRate: 45,  rating: 4.4, isAvailable: true,  imageUrl: "images/BYD Dolphin.jpg" },
  { id: "C003", make: "MG",            model: "MG4 Electric",  category: "Hatchback", seats: 5, transmission: "Automatic", rangeKm: 450, dailyRate: 49,  rating: 4.4, isAvailable: true,  imageUrl: "images/MG4.jpg" },
  { id: "C004", make: "BYD",           model: "Atto 3",        category: "SUV",       seats: 5, transmission: "Automatic", rangeKm: 420, dailyRate: 59,  rating: 4.4, isAvailable: true,  imageUrl: "images/BYD ATTO 3.jpg" },
  { id: "C005", make: "Hyundai",       model: "Kona Electric", category: "SUV",       seats: 5, transmission: "Automatic", rangeKm: 490, dailyRate: 65,  rating: 4.5, isAvailable: true,  imageUrl: "images/Hyundai Kona.jpg" },
  { id: "C006", make: "Hyundai",       model: "Ioniq 6",       category: "Sedan",     seats: 5, transmission: "Automatic", rangeKm: 610, dailyRate: 79,  rating: 4.6, isAvailable: false, imageUrl: "images/Hyundai Ioniq 6.jpg" },
  { id: "C007", make: "Tesla",         model: "Model 3",       category: "Sedan",     seats: 5, transmission: "Automatic", rangeKm: 513, dailyRate: 99,  rating: 4.8, isAvailable: true,  imageUrl: "images/Tesla Model 3.jpg" },
  { id: "C008", make: "Tesla",         model: "Model Y",       category: "SUV",       seats: 5, transmission: "Automatic", rangeKm: 533, dailyRate: 119, rating: 4.7, isAvailable: true,  imageUrl: "images/Tesla Model Y.jpg" },
  { id: "C009", make: "Tesla",         model: "Model S",       category: "Luxury",    seats: 5, transmission: "Automatic", rangeKm: 634, dailyRate: 129, rating: 4.8, isAvailable: true,  imageUrl: "images/Tesla Model S.jpg" },
  { id: "C010", make: "Tesla",         model: "Model X",       category: "SUV",       seats: 7, transmission: "Automatic", rangeKm: 560, dailyRate: 149, rating: 4.7, isAvailable: false, imageUrl: "images/Tesla Model X.jpg" },
  { id: "C011", make: "Mercedes-Benz", model: "EQS",           category: "Luxury",    seats: 5, transmission: "Automatic", rangeKm: 700, dailyRate: 189, rating: 4.8, isAvailable: true,  imageUrl: "images/Mercedes-Benz EQS.jpg" },
  { id: "C012", make: "Porsche",       model: "Taycan",        category: "Sports",    seats: 4, transmission: "Automatic", rangeKm: 460, dailyRate: 249, rating: 4.9, isAvailable: true,  imageUrl: "images/Porsche Taycan.jpg" }
];

// ======================================================================
// SHARED: customer reviews (Fleet, My Trips, Employee and Home pages use this)
// ======================================================================
// Reviews are saved in the browser (localStorage), like bookings and accounts.
// One review per booking, and only for a completed (paid) booking. The sample reviews below
// stand in for earlier customers, so the ratings on the Fleet page mean something from day one.

const AZoomReviews = (() => {
  const KEY = "azoomReviews";

  const seed = [
    { id: "S01", ref: "AZ-OLD-01", name: "Aisha R.",     carName: "Nissan Leaf",           rating: 4, date: "2026-09-02", comment: "Great for city driving and cheap to run. The range was plenty for a few days around the island." },
    { id: "S02", ref: "AZ-OLD-02", name: "Marcus L.",    carName: "Nissan Leaf",           rating: 5, date: "2026-09-18", comment: "Smooth pick-up and the car was spotless and fully charged." },
    { id: "S03", ref: "AZ-OLD-03", name: "Hui Min T.",   carName: "Nissan Leaf",           rating: 4, date: "2026-10-05", comment: "Compact and easy to park. Would book again." },
    { id: "S04", ref: "AZ-OLD-04", name: "Daryl K.",     carName: "BYD Dolphin",           rating: 5, date: "2026-08-28", comment: "Surprisingly roomy and really fun to drive. Navigation was easy to use." },
    { id: "S05", ref: "AZ-OLD-05", name: "Priscilla N.", carName: "BYD Dolphin",           rating: 4, date: "2026-09-11", comment: "Good value for a week-long rental." },
    { id: "S06", ref: "AZ-OLD-06", name: "Imran S.",     carName: "BYD Dolphin",           rating: 4, date: "2026-10-01", comment: "Quiet and comfortable. I wished the range was a little longer." },
    { id: "S07", ref: "AZ-OLD-07", name: "Jason C.",     carName: "MG MG4 Electric",       rating: 5, date: "2026-09-06", comment: "Sporty feel and plenty of range for a trip up to Woodlands and back." },
    { id: "S08", ref: "AZ-OLD-08", name: "Mei Ling H.",  carName: "MG MG4 Electric",       rating: 4, date: "2026-09-22", comment: "Comfortable seats and easy charging nearby." },
    { id: "S09", ref: "AZ-OLD-09", name: "Raj P.",       carName: "MG MG4 Electric",       rating: 4, date: "2026-10-08", comment: "Great car for the price." },
    { id: "S10", ref: "AZ-OLD-10", name: "Nur Aini A.",  carName: "BYD Atto 3",            rating: 4, date: "2026-08-30", comment: "Lots of boot space for our family luggage." },
    { id: "S11", ref: "AZ-OLD-11", name: "Kelvin W.",    carName: "BYD Atto 3",            rating: 5, date: "2026-09-14", comment: "Smooth ride and a very clean car." },
    { id: "S12", ref: "AZ-OLD-12", name: "Sandra Y.",    carName: "BYD Atto 3",            rating: 4, date: "2026-10-03", comment: "Spacious SUV that handled the rain well." },
    { id: "S13", ref: "AZ-OLD-13", name: "Wei Jie L.",   carName: "Hyundai Kona Electric", rating: 5, date: "2026-09-01", comment: "Perfect size for our weekend away. Charging was never a worry." },
    { id: "S14", ref: "AZ-OLD-14", name: "Farah M.",     carName: "Hyundai Kona Electric", rating: 4, date: "2026-09-20", comment: "Comfortable and quiet." },
    { id: "S15", ref: "AZ-OLD-15", name: "Daniel P.",    carName: "Hyundai Kona Electric", rating: 5, date: "2026-10-07", comment: "Loved how easy it was to drive around town." },
    { id: "S16", ref: "AZ-OLD-16", name: "Amanda T.",    carName: "Hyundai Ioniq 6",       rating: 5, date: "2026-09-09", comment: "The range is fantastic. I drove across the island twice on one charge." },
    { id: "S17", ref: "AZ-OLD-17", name: "Gopal R.",     carName: "Hyundai Ioniq 6",       rating: 4, date: "2026-09-27", comment: "Stylish and very quiet." },
    { id: "S18", ref: "AZ-OLD-18", name: "Eric Z.",      carName: "Tesla Model 3",         rating: 5, date: "2026-08-25", comment: "Fast, smooth and the driver-assist features were great on the expressway." },
    { id: "S19", ref: "AZ-OLD-19", name: "Chloe L.",     carName: "Tesla Model 3",         rating: 5, date: "2026-09-16", comment: "Best rental I have had in years." },
    { id: "S20", ref: "AZ-OLD-20", name: "Sam H.",       carName: "Tesla Model 3",         rating: 4, date: "2026-10-04", comment: "Great car. Pick-up took a few minutes longer than expected." },
    { id: "S21", ref: "AZ-OLD-21", name: "Victoria N.",  carName: "Tesla Model Y",         rating: 5, date: "2026-09-03", comment: "Plenty of room for the kids and all our bags." },
    { id: "S22", ref: "AZ-OLD-22", name: "Hafiz A.",     carName: "Tesla Model Y",         rating: 4, date: "2026-09-24", comment: "Great range and fun to drive." },
    { id: "S23", ref: "AZ-OLD-23", name: "Jolene K.",    carName: "Tesla Model Y",         rating: 5, date: "2026-10-09", comment: "Premium feel, and returning it at the car park was effortless." },
    { id: "S24", ref: "AZ-OLD-24", name: "Ryan O.",      carName: "Tesla Model S",         rating: 5, date: "2026-09-05", comment: "Incredible acceleration and a very comfortable cabin." },
    { id: "S25", ref: "AZ-OLD-25", name: "Tiffany G.",   carName: "Tesla Model S",         rating: 5, date: "2026-09-26", comment: "Felt like a luxury car for the weekend. I would rent it again." },
    { id: "S26", ref: "AZ-OLD-26", name: "Anand V.",     carName: "Tesla Model S",         rating: 4, date: "2026-10-06", comment: "Fantastic car. A little pricey but worth it." },
    { id: "S27", ref: "AZ-OLD-27", name: "Priya S.",     carName: "Tesla Model X",         rating: 5, date: "2026-09-12", comment: "The doors were a big hit with the kids!" },
    { id: "S28", ref: "AZ-OLD-28", name: "Collin T.",    carName: "Tesla Model X",         rating: 4, date: "2026-10-02", comment: "Seven seats made our family trip easy." },
    { id: "S29", ref: "AZ-OLD-29", name: "Margaret L.",  carName: "Mercedes-Benz EQS",     rating: 5, date: "2026-09-08", comment: "Silent, smooth and beautifully finished." },
    { id: "S30", ref: "AZ-OLD-30", name: "Jonathan B.",  carName: "Mercedes-Benz EQS",     rating: 5, date: "2026-09-29", comment: "Perfect for a business trip. Everyone was impressed." },
    { id: "S31", ref: "AZ-OLD-31", name: "Siti R.",      carName: "Mercedes-Benz EQS",     rating: 4, date: "2026-10-10", comment: "Luxurious. The big screen takes some getting used to." },
    { id: "S32", ref: "AZ-OLD-32", name: "Alex M.",      carName: "Porsche Taycan",        rating: 5, date: "2026-09-07", comment: "An absolute thrill to drive and worth every dollar." },
    { id: "S33", ref: "AZ-OLD-33", name: "Nadia F.",     carName: "Porsche Taycan",        rating: 5, date: "2026-09-30", comment: "Stunning car, fast charging, and an unforgettable weekend." },
    { id: "S34", ref: "AZ-OLD-34", name: "Brandon S.",   carName: "Porsche Taycan",        rating: 4, date: "2026-10-11", comment: "Great, but the rear seats are tight." }
  ];

  const copySeed = () => JSON.parse(JSON.stringify(seed));

  const save = (list) => {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (error) { /* storage unavailable */ }
  };

  const load = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (Array.isArray(saved)) return saved;
    } catch (error) { /* fall back to the sample reviews */ }
    return copySeed();
  };

  const reset = () => {
    const fresh = copySeed();
    save(fresh);
    return fresh;
  };

  // Average rating and number of reviews for every car, worked out with reduce
  const stats = (list) => {
    const totals = list.reduce((all, review) => {
      const entry = all[review.carName] || { count: 0, sum: 0 };
      entry.count += 1;
      entry.sum += review.rating;
      all[review.carName] = entry;
      return all;
    }, {});
    Object.keys(totals).forEach((name) => {
      totals[name] = { count: totals[name].count, average: Math.round((totals[name].sum / totals[name].count) * 10) / 10 };
    });
    return totals;
  };

  // "John Tan" becomes "John T.", so a review does not show a full name
  const displayName = (fullName) => {
    const parts = fullName.trim().split(/\s+/);
    return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.` : parts[0];
  };

  // Text typed by customers is escaped before it goes into the page
  const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  const formatDate = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });

  // Five stars, filled up to the rating (the label is for screen readers)
  const stars = (rating) => {
    const whole = Math.max(0, Math.min(5, Math.round(rating)));
    return `<span class="stars" role="img" aria-label="${rating} out of 5 stars"><span class="stars-on">${"\u2605".repeat(whole)}</span><span class="stars-off">${"\u2605".repeat(5 - whole)}</span></span>`;
  };

  // One review as a card (used on the Fleet, Employee and Home pages)
  const cardHtml = (review, options = {}) => `
    <article class="review-card">
      ${stars(review.rating)}
      ${review.comment ? `<p class="review-text">\u201C${escapeHtml(review.comment)}\u201D</p>` : `<p class="review-text review-text-empty">No written comment.</p>`}
      <p class="review-meta">
        <strong>${escapeHtml(review.name)}</strong>
        ${options.showCar ? ` \u00B7 ${escapeHtml(review.carName)}` : ""}
        \u00B7 ${formatDate(review.date)}${options.showRef ? ` \u00B7 Booking ${escapeHtml(review.ref)}` : ""}
      </p>
    </article>`;

  return { load, save, reset, stats, displayName, escapeHtml, formatDate, stars, cardHtml };
})();

// ======================================================================
// SHARED: accounts and login (every page uses this)
// ======================================================================
// There is no back end, so accounts live in the browser (localStorage).
//
// Passwords are HASHED, not encrypted. A hash is a one-way scramble: nobody (not even this
// code) can turn it back into the password, so there is no secret key to steal. To check a
// login, the typed password is scrambled the same way and the two results are compared.
//
//  - Each password is mixed with its own random "salt", so two people with the same password
//    get different hashes.
//  - The scrambling method is PBKDF2 with SHA-256, run 150,000 times. That is deliberately slow,
//    which makes guessing passwords from a stolen copy very expensive. The browser's built-in
//    crypto does the work.
//  - Older accounts (made with a single salted SHA-256) are upgraded the next time they log in.
//
// (A real website would do all of this on a server. Browser code can be read and changed by
// anyone, so this is a demonstration for the assignment, not real security.)

const AZoomAuth = (() => {
  const USERS_KEY = "azoomUsers";
  const SESSION_KEY = "azoomSession";
  const ATTEMPTS_KEY = "azoomLoginAttempts";
  const MAX_ATTEMPTS = 5;            // wrong passwords allowed in a row
  const LOCK_SECONDS = 30;           // how long the account is paused after that
  const PBKDF2_ITERATIONS = 150000;  // how many times the password is scrambled
  const STRONG = "pbkdf2-sha256";

  // Demo accounts, so the site can be shown without signing up first
  const demoAccounts = [
    { name: "John Tan",   email: "john@example.com",    role: "customer", password: "Customer@2026" },
    { name: "Maya Lim",   email: "maya@example.com",    role: "customer", password: "Customer@2026" },
    { name: "Daniel Ong", email: "daniel@example.com",  role: "customer", password: "Customer@2026" },
    { name: "Priya Nair", email: "priya@example.com",   role: "customer", password: "Customer@2026" },
    { name: "Wei Ling Koh", email: "weiling@example.com", role: "customer", password: "Customer@2026" },
    { name: "Alice Chen", email: "alice@azoom.example", role: "employee", password: "Staff@2026" },
    { name: "Ben Ong",    email: "ben@azoom.example",   role: "employee", password: "Staff@2026" },
    { name: "Chloe Wong", email: "chloe@azoom.example", role: "employee", password: "Staff@2026" }
  ];

  // ----- storage helpers -----
  const read = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value === null || value === undefined ? fallback : value;
    } catch (error) { return fallback; }
  };
  const write = (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { /* storage unavailable */ }
  };

  // ----- SHA-256, written out so older accounts and very old browsers still work -----
  const sha256 = (text) => {
    const bytes = new TextEncoder().encode(text);

    // The constants come from the first 64 prime numbers
    const primes = [];
    for (let n = 2; primes.length < 64; n++) {
      if (primes.every((p) => n % p)) primes.push(n);
    }
    const fraction = (x) => Math.floor((x - Math.floor(x)) * 4294967296);
    const K = primes.map((p) => fraction(Math.cbrt(p)));
    let H = primes.slice(0, 8).map((p) => fraction(Math.sqrt(p)));

    // Pad the message to a multiple of 64 bytes
    const bitLength = bytes.length * 8;
    const padded = new Uint8Array(((bytes.length + 9 + 63) >> 6) << 6);
    padded.set(bytes);
    padded[bytes.length] = 0x80;
    const view = new DataView(padded.buffer);
    view.setUint32(padded.length - 8, Math.floor(bitLength / 4294967296));
    view.setUint32(padded.length - 4, bitLength >>> 0);

    const rotr = (x, n) => (x >>> n) | (x << (32 - n));
    const w = new Uint32Array(64);

    for (let offset = 0; offset < padded.length; offset += 64) {
      for (let i = 0; i < 16; i++) w[i] = view.getUint32(offset + i * 4);
      for (let i = 16; i < 64; i++) {
        const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }

      let [a, b, c, d, e, f, g, h] = H;
      for (let i = 0; i < 64; i++) {
        const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        const ch = (e & f) ^ (~e & g);
        const t1 = (h + S1 + ch + K[i] + w[i]) >>> 0;
        const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        const maj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0;
        d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      H = [H[0] + a, H[1] + b, H[2] + c, H[3] + d, H[4] + e, H[5] + f, H[6] + g, H[7] + h].map((x) => x >>> 0);
    }
    return H.map((x) => x.toString(16).padStart(8, "0")).join("");
  };

  // ----- hex helpers and random salt -----
  const toHex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  const fromHex = (hex) => Uint8Array.from(hex.match(/../g) || [], (pair) => parseInt(pair, 16));

  const newSalt = () => {
    const bytes = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 256); });
    }
    return toHex(bytes);
  };

  // Compares two texts without stopping at the first difference
  const sameText = (a, b) => {
    if (a.length !== b.length) return false;
    let difference = 0;
    for (let i = 0; i < a.length; i++) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return difference === 0;
  };

  // ----- hashing a password -----
  const canUseStrongHash = () => Boolean(window.crypto && window.crypto.subtle);

  const pbkdf2 = async (password, saltHex, iterations) => {
    const key = await window.crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await window.crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt: fromHex(saltHex), iterations }, key, 256);
    return toHex(new Uint8Array(bits));
  };

  // A new salt and hash for a password, using the strongest method this browser allows
  const makeSecret = async (password) => {
    const salt = newSalt();
    if (canUseStrongHash()) {
      return { algo: STRONG, iterations: PBKDF2_ITERATIONS, salt, hash: await pbkdf2(password, salt, PBKDF2_ITERATIONS) };
    }
    return { algo: "sha256", salt, hash: sha256(`${salt}:${password}`) };
  };

  // Does this typed password match the saved hash?
  const checkSecret = async (user, password) => {
    if (user.algo === STRONG) {
      if (!canUseStrongHash()) return false;
      return sameText(await pbkdf2(password, user.salt, user.iterations || PBKDF2_ITERATIONS), user.hash);
    }
    return sameText(sha256(`${user.salt}:${password}`), user.hash);    // older accounts
  };

  const makeUser = async (name, email, role, password) =>
    ({ name, email: email.trim().toLowerCase(), role, ...(await makeSecret(password)) });

  // ----- users -----
  const getUsers = () => read(USERS_KEY, []);
  const saveUsers = (users) => write(USERS_KEY, users);

  const ensureDemoAccounts = async () => {
    const users = getUsers();
    let changed = false;
    for (const demo of demoAccounts) {
      if (!users.some((user) => user.email === demo.email)) {
        users.push(await makeUser(demo.name, demo.email, demo.role, demo.password));
        changed = true;
      }
    }
    if (changed) saveUsers(users);
  };
  // Pages that log people in wait for this to finish
  const ready = ensureDemoAccounts().catch(() => { /* storage unavailable */ });

  // ----- session (who is logged in) -----
  const getSession = () => {
    const session = read(SESSION_KEY, null);
    return session && session.email && session.role ? session : null;
  };
  const startSession = (user) => {
    const session = { name: user.name, email: user.email, role: user.role };
    write(SESSION_KEY, session);
    return session;
  };
  const logout = () => {
    try { localStorage.removeItem(SESSION_KEY); } catch (error) { /* ignore */ }
  };

  // ----- rules -----
  const isEmail = (text) => /^\S+@\S+\.\S+$/.test(text);

  // Returns a message if the password is not good enough, or "" if it is fine
  const passwordProblem = (password) => {
    if (password.length < 8) return "Use at least 8 characters for your password.";
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) return "Your password needs at least one letter and one number.";
    return "";
  };

  // Only plain page links like "booking.html?car=C007" may be used after login
  // (so nobody can send a visitor to another website)
  const safeNext = (raw) => (raw && /^[A-Za-z0-9_-]+\.html(\?[A-Za-z0-9_=&%.-]*)?$/.test(raw) ? raw : "");

  // ----- actions (these are async because hashing takes a moment) -----
  const register = async (name, email, password) => {
    await ready;
    const cleanEmail = email.trim().toLowerCase();
    if (name.trim().length < 2) return { ok: false, field: "name", error: "Enter your full name." };
    if (!isEmail(cleanEmail)) return { ok: false, field: "email", error: "Enter a valid email address, like john@example.com." };
    const problem = passwordProblem(password);
    if (problem) return { ok: false, field: "password", error: problem };

    const users = getUsers();
    if (users.some((user) => user.email === cleanEmail)) {
      return { ok: false, field: "email", error: "An account with this email already exists. Try logging in." };
    }

    const user = await makeUser(name.trim(), cleanEmail, "customer", password);   // sign-up always makes a customer
    users.push(user);
    saveUsers(users);
    return { ok: true, session: startSession(user) };
  };

  const login = async (email, password) => {
    await ready;
    const key = email.trim().toLowerCase();
    const attempts = read(ATTEMPTS_KEY, {});
    const entry = attempts[key] || { count: 0, lockedUntil: 0 };
    const now = Date.now();

    if (entry.lockedUntil > now) {
      const seconds = Math.ceil((entry.lockedUntil - now) / 1000);
      return { ok: false, error: `Too many wrong passwords. Try again in ${seconds} seconds.` };
    }

    const users = getUsers();
    const user = users.find((item) => item.email === key);
    if (!user || !(await checkSecret(user, password))) {
      entry.count += 1;
      let error = "Incorrect email or password.";
      if (entry.count >= MAX_ATTEMPTS) {
        entry.count = 0;
        entry.lockedUntil = now + LOCK_SECONDS * 1000;
        error = `Too many wrong passwords. This account is paused for ${LOCK_SECONDS} seconds.`;
      }
      attempts[key] = entry;
      write(ATTEMPTS_KEY, attempts);
      return { ok: false, error };
    }

    delete attempts[key];
    write(ATTEMPTS_KEY, attempts);

    // An older, weaker hash is replaced by the strong one now that we know the password
    if (user.algo !== STRONG && canUseStrongHash()) {
      Object.assign(user, await makeSecret(password));
      saveUsers(users);
    }
    return { ok: true, session: startSession(user) };
  };

  const changePassword = async (currentPassword, newPassword) => {
    await ready;
    const session = getSession();
    if (!session) return { ok: false, field: "current", error: "Please log in again." };

    const users = getUsers();
    const user = users.find((item) => item.email === session.email);
    if (!user || !(await checkSecret(user, currentPassword))) {
      return { ok: false, field: "current", error: "Your current password is incorrect." };
    }
    const problem = passwordProblem(newPassword);
    if (problem) return { ok: false, field: "new", error: problem };
    if (newPassword === currentPassword) return { ok: false, field: "new", error: "Choose a new password that is different from the current one." };

    Object.assign(user, await makeSecret(newPassword));
    saveUsers(users);
    return { ok: true };
  };

  // Header link: "Log in" when nobody is logged in, otherwise the person's first name
  const refreshHeader = () => {
    const link = document.getElementById("account-link");
    if (!link) return;
    const session = getSession();
    const label = link.querySelector("span");
    if (session) {
      label.textContent = session.name.split(" ")[0];
      link.setAttribute("aria-label", `Account of ${session.name}`);
      link.title = `Logged in as ${session.name}`;
    } else {
      label.textContent = "Log in";
      link.removeAttribute("aria-label");
      link.removeAttribute("title");
    }
  };

  return { demoAccounts, ready, getSession, register, login, logout, changePassword, passwordProblem, isEmail, safeNext, sha256, refreshHeader };
})();

// ======================================================================
// ALL PAGES: header and mobile menu
// ======================================================================

document.addEventListener("DOMContentLoaded", function () {
  var header = document.getElementById("site-header");
  var toggle = document.getElementById("menu-toggle");
  if (!header || !toggle) return;

  // 1. Header turns white once the page is scrolled
  function updateHeader() {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader);

  // 2. Mobile menu open / close
  toggle.addEventListener("click", function () {
    var isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", isOpen);
    toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
});

// ======================================================================
// FLEET PAGE: search, filters, sort and car cards
// ======================================================================

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("cars-grid")) return;   // only runs on the fleet page

  // The cars come from the shared AZOOM_CARS list at the top of this file
  const carsData = AZOOM_CARS;

  // DOM elements
  const carsGrid = document.getElementById("cars-grid");
  const resultCount = document.getElementById("result-count");
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort");
  const priceRange = document.getElementById("price-range");
  const priceValue = document.getElementById("price-value");
  const resetButton = document.getElementById("reset-filters");
  const chips = document.querySelectorAll(".chip");

  // The current filter choices live in one object
  const defaultFilters = { search: "", category: "All", seats: "All", status: "All", maxPrice: 300, sort: "price-asc" };
  const filters = { ...defaultFilters };

  // Ratings come from real customer reviews (a car with no reviews yet keeps its starting rating)
  const reviews = AZoomReviews.load();
  const reviewStats = AZoomReviews.stats(reviews);
  const ratingOf = (car) => {
    const entry = reviewStats[`${car.make} ${car.model}`];
    return entry ? entry.average : car.rating;
  };
  const reviewCountOf = (car) => {
    const entry = reviewStats[`${car.make} ${car.model}`];
    return entry ? entry.count : 0;
  };

  // The sort options, each one a compare function
  const sorters = {
    "price-asc": (a, b) => a.dailyRate - b.dailyRate,
    "price-desc": (a, b) => b.dailyRate - a.dailyRate,
    "rating": (a, b) => ratingOf(b) - ratingOf(a),
    "range": (a, b) => b.rangeKm - a.rangeKm
  };

  // --- HIGHER-ORDER FUNCTION 1: Array.prototype.reduce ---
  // Counts available cars among the cars currently shown and writes the summary line
  const renderResultCount = (cars) => {
    const availableCount = cars.reduce((total, car) => (car.isAvailable ? total + 1 : total), 0);
    const rentedCount = cars.length - availableCount;

    if (cars.length === 0) {
      resultCount.textContent = "No cars found";
      return;
    }

    let text = `${availableCount} ${availableCount === 1 ? "car" : "cars"} available`;
    if (rentedCount > 0) {
      text += ` \u00B7 ${rentedCount} rented`;
    }
    resultCount.textContent = text;
  };

  // --- HIGHER-ORDER FUNCTION 2: Array.prototype.map ---
  // Turns each car object into a block of HTML, then joins them into one string
  const renderCars = (cars) => {
    if (cars.length === 0) {
      carsGrid.innerHTML = `
        <div class="no-results">
          <h3>No cars match your filters</h3>
          <p>Try a different search or widen your filters.</p>
          <button type="button" class="link-button" data-action="reset">Reset all filters</button>
        </div>`;
      return;
    }

    carsGrid.innerHTML = cars.map((car) => `
      <article class="car-card">
        <div class="car-media">
          <span class="photo-fallback" aria-hidden="true"><svg class="icon"><use href="#i-car"/></svg></span>
          <img src="${car.imageUrl}" alt="${car.make} ${car.model}" loading="lazy" onerror="this.remove()">
          <div class="car-tags">
            <span class="tag tag-category">${car.category}</span>
            <span class="tag ${car.isAvailable ? "tag-available" : "tag-rented"}">${car.isAvailable ? "Available" : "Rented"}</span>
            <span class="tag tag-rating"><svg class="icon icon-filled"><use href="#i-star"/></svg> ${ratingOf(car).toFixed(1)}</span>
          </div>
        </div>

        <div class="car-body">
          <p class="car-make">${car.make}</p>
          <h3 class="car-model">${car.model}</h3>

          <ul class="car-specs">
            <li><svg class="icon"><use href="#i-users"/></svg> ${car.seats} seats</li>
            <li><svg class="icon"><use href="#i-gear"/></svg> ${car.transmission}</li>
            <li><svg class="icon"><use href="#i-zap"/></svg> ${car.rangeKm} km range</li>
          </ul>

          ${reviewCountOf(car) > 0
            ? `<button type="button" class="reviews-link" data-reviews="${car.id}">Read ${reviewCountOf(car)} ${reviewCountOf(car) === 1 ? "review" : "reviews"}</button>`
            : `<span class="reviews-none">No reviews yet</span>`}

          <div class="car-footer">
            <p class="car-price">$${car.dailyRate} <span>/day</span></p>
            ${car.isAvailable
              ? `<a class="button button-primary button-sm" href="booking.html?car=${car.id}">Reserve <svg class="icon"><use href="#i-chevron-right"/></svg></a>`
              : `<button type="button" class="button button-sm" disabled>Unavailable</button>`}
          </div>
        </div>
      </article>
    `).join("");
  };

  // --- HIGHER-ORDER FUNCTION 3: Array.prototype.filter ---
  // Keeps only the cars that match every active filter, then sorts and draws them
  const filterAndDisplayCars = () => {
    const filteredCars = carsData.filter((car) => {
      const searchText = `${car.make} ${car.model}`.toLowerCase();
      const matchSearch = searchText.includes(filters.search);
      const matchCategory = filters.category === "All" || car.category === filters.category;
      const matchSeats = filters.seats === "All" || car.seats === Number(filters.seats);
      const matchStatus =
        filters.status === "All" ||
        (filters.status === "Available" && car.isAvailable) ||
        (filters.status === "Rented" && !car.isAvailable);
      const matchPrice = car.dailyRate <= filters.maxPrice;

      return matchSearch && matchCategory && matchSeats && matchStatus && matchPrice;
    });

    // Sort a copy so the original array keeps its order
    filteredCars.sort(sorters[filters.sort]);

    renderCars(filteredCars);
    renderResultCount(filteredCars);
  };

  // Highlights the chosen chip in a group and un-highlights the others
  const setChipActive = (group, value) => {
    chips.forEach((chip) => {
      if (chip.dataset.group === group) {
        const isActive = chip.dataset.value === value;
        chip.classList.toggle("is-active", isActive);
        chip.setAttribute("aria-pressed", isActive);
      }
    });
  };

  const updatePriceLabel = () => {
    priceValue.textContent = `$${filters.maxPrice}/DAY`;
  };

  const resetFilters = () => {
    Object.assign(filters, defaultFilters);
    searchInput.value = "";
    sortSelect.value = filters.sort;
    priceRange.value = filters.maxPrice;
    updatePriceLabel();
    ["category", "seats", "status"].forEach((group) => setChipActive(group, "All"));
    filterAndDisplayCars();
  };

  // --- Event listeners ---
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filters[chip.dataset.group] = chip.dataset.value;
      setChipActive(chip.dataset.group, chip.dataset.value);
      filterAndDisplayCars();
    });
  });

  searchInput.addEventListener("input", () => {
    filters.search = searchInput.value.trim().toLowerCase();
    filterAndDisplayCars();
  });

  sortSelect.addEventListener("change", () => {
    filters.sort = sortSelect.value;
    filterAndDisplayCars();
  });

  priceRange.addEventListener("input", () => {
    filters.maxPrice = Number(priceRange.value);
    updatePriceLabel();
    filterAndDisplayCars();
  });

  resetButton.addEventListener("click", resetFilters);

  // The "Reset all filters" button inside the empty-state message
  carsGrid.addEventListener("click", (event) => {
    if (event.target.dataset.action === "reset") {
      resetFilters();
    }
  });

  // If the visitor came from the home page search, apply the vehicle type they chose
  const typeToCategory = { Hatchback: "Hatchback", SUV: "SUV", Sedan: "Sedan", Luxury: "Luxury", Sports: "Sports" };
  const typeParam = new URLSearchParams(window.location.search).get("type");
  if (typeParam && typeToCategory[typeParam]) {
    filters.category = typeToCategory[typeParam];
    setChipActive("category", filters.category);
  }

  // ---------- Reading a car's reviews ----------
  const reviewsDialog = document.getElementById("car-reviews-dialog");

  carsGrid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-reviews]");
    if (!button) return;

    const car = carsData.find((item) => item.id === button.dataset.reviews);
    const carName = `${car.make} ${car.model}`;
    const carReviews = reviews.filter((review) => review.carName === carName).sort((a, b) => b.date.localeCompare(a.date));

    document.getElementById("car-reviews-title").textContent = `${carName} reviews`;
    document.getElementById("car-reviews-summary").innerHTML =
      `${AZoomReviews.stars(ratingOf(car))} <strong>${ratingOf(car).toFixed(1)}</strong> from ${carReviews.length} ${carReviews.length === 1 ? "review" : "reviews"}`;
    document.getElementById("car-reviews-list").innerHTML = carReviews.map((review) => AZoomReviews.cardHtml(review)).join("");
    reviewsDialog.showModal();
  });

  reviewsDialog.addEventListener("click", (event) => {
    if (event.target.closest("[data-close]")) reviewsDialog.close();
  });

  // First draw
  updatePriceLabel();
  filterAndDisplayCars();
});

// ======================================================================
// MY TRIPS PAGE: look up bookings, return a car, pay the final bill
// ======================================================================

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("lookup-form")) return;   // only runs on the My Trips page

  // Customers only: log in (or sign up) to see trips
  const session = AZoomAuth.getSession();
  if (!session || session.role !== "customer") {
    const here = window.location.pathname.split("/").pop() + window.location.search;
    window.location.replace(`login.html?next=${encodeURIComponent(here)}${session ? "&need=customer" : ""}`);
    return;
  }
  document.querySelector(".trips-page").classList.add("is-ready");
  document.getElementById("trips-account").textContent = `${session.name} (${session.email})`;

  // ---------- 1. Booking data ----------
  // The bookings come from bookings.js, which is shared with the Employee page.
  let bookings = AZoomBookings.load();
  const saveBookings = () => AZoomBookings.save(bookings);
  let shownRefs = [];            // the booking references currently on screen
  let activeBooking = null;      // the booking a dialog is working on
  let reviews = AZoomReviews.load();
  const reviewFor = (ref) => reviews.find((item) => item.ref === ref);

  // ---------- 2. Page elements ----------
  const lookupForm = document.getElementById("lookup-form");
  const refInput = document.getElementById("booking-ref");
  const emailInput = document.getElementById("booking-email");
  const lookupMessage = document.getElementById("lookup-message");
  const resultsEl = document.getElementById("results");
  const resetDemoButton = document.getElementById("reset-demo");

  const returnDialog = document.getElementById("return-dialog");
  const returnForm = document.getElementById("return-form");
  const returnCarName = document.getElementById("return-car-name");
  const returnCarPark = document.getElementById("return-carpark");
  const returnConfirm = document.getElementById("return-confirm");
  const returnMessage = document.getElementById("return-message");

  const payDialog = document.getElementById("pay-dialog");
  const payView = document.getElementById("pay-view");
  const paySuccess = document.getElementById("pay-success");
  const payForm = document.getElementById("pay-form");
  const payCarName = document.getElementById("pay-car-name");
  const payBill = document.getElementById("pay-bill");
  const payMessage = document.getElementById("pay-message");
  const cardName = document.getElementById("card-name");
  const cardNumber = document.getElementById("card-number");
  const cardExpiry = document.getElementById("card-expiry");
  const cardCvv = document.getElementById("card-cvv");

  // ---------- 3. Small helpers ----------
  const statusOrder = ["reserved", "active", "returned", "inspected", "paid"];
  const stepLabels = ["Reserved", "Picked up", "Returned", "Inspected", "Paid"];
  const statusInfo = {
    reserved:  { label: "Reserved",           tone: "blue" },
    active:    { label: "In rental",          tone: "amber" },
    returned:  { label: "Awaiting inspection", tone: "orange" },
    inspected: { label: "Final bill ready",   tone: "purple" },
    paid:      { label: "Completed",          tone: "green" }
  };

  const formatDate = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });

  const formatMoney = (amount) => `$${amount.toLocaleString("en-SG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Free text (like an employee's damage note) is escaped before going into the page
  const esc = (text) => String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  const rentalDays = (booking) =>
    Math.max(1, Math.round((new Date(booking.returnDate) - new Date(booking.pickupDate)) / 86400000));

  // The bill is a list of line items. reduce adds them up.
  const getBillItems = (booking) => {
    const days = rentalDays(booking);
    const items = [{ label: `Rental: ${days} ${days === 1 ? "day" : "days"} \u00D7 $${booking.dailyRate}`, amount: days * booking.dailyRate }];
    if (booking.damage.amount > 0) {
      items.push({ label: `Damage: ${esc(booking.damage.note)}`, amount: booking.damage.amount });
    }
    return items;
  };

  const getBillTotal = (booking) => getBillItems(booking).reduce((sum, item) => sum + item.amount, 0);

  // ---------- 4. Drawing the results ----------
  const renderProgress = (status) => {
    const current = statusOrder.indexOf(status);
    const steps = stepLabels.map((label, index) => {
      const isDone = index < current || status === "paid";
      const isCurrent = index === current && status !== "paid";
      const dot = isDone ? `<svg class="icon"><use href="#i-check"/></svg>` : index + 1;
      return `
        <li class="${isDone ? "is-done" : isCurrent ? "is-current" : ""}" ${isCurrent ? 'aria-current="step"' : ""}>
          <span class="dot">${dot}</span>${label}
        </li>`;
    }).join("");
    return `<ol class="progress" aria-label="Rental progress">${steps}</ol>`;
  };

  // What the bottom row of each card says, and which button (if any) it shows
  const renderAction = (booking) => {
    switch (booking.status) {
      case "reserved":
        return `<p>Collect your car at the <strong>${booking.pickupBranch}</strong> office. Bring your booking reference and driving licence.</p>`;
      case "active":
        return `<p>Enjoying the ride? When you are done, park at a designated car park and confirm your return.</p>
                <button type="button" class="button button-primary button-sm" data-action="return" data-ref="${booking.ref}">Return car</button>`;
      case "returned":
        return `<p>Returned at <strong>${booking.returnCarPark}</strong>. An AZoom employee will inspect the car, then your final bill will appear here.</p>`;
      case "inspected":
        return `<p>Inspection done. Your final bill is <strong>${formatMoney(getBillTotal(booking))}</strong>.</p>
                <button type="button" class="button button-primary button-sm" data-action="pay" data-ref="${booking.ref}">Pay final bill</button>`;
      default: {
        // A completed trip can be reviewed once (and the review can be edited or deleted)
        const paid = `Paid <strong>${formatMoney(getBillTotal(booking))}</strong> on ${formatDate(booking.paidOn)}. Thank you for renting with AZoom!`;
        const review = reviewFor(booking.ref);
        return review
          ? `<p>${paid}<br><span class="my-review">Your review: ${AZoomReviews.stars(review.rating)}${review.comment ? ` \u201C${AZoomReviews.escapeHtml(review.comment)}\u201D` : ""}</span></p>
             <button type="button" class="button button-ghost button-sm" data-action="review" data-ref="${booking.ref}">Edit review</button>`
          : `<p>${paid}</p>
             <button type="button" class="button button-primary button-sm" data-action="review" data-ref="${booking.ref}">Leave a review</button>`;
      }
    }
  };

  const renderBookingCard = (booking) => {
    const days = rentalDays(booking);
    const info = statusInfo[booking.status];
    const isBilled = booking.status === "inspected" || booking.status === "paid";

    return `
      <article class="trip-card">
        <div class="trip-head">
          <span class="icon-box"><svg class="icon"><use href="#i-car"/></svg></span>
          <div class="trip-title">
            <h3>${booking.carName}</h3>
            <p>Booking ${booking.ref}</p>
          </div>
          <span class="status status-${info.tone}">${info.label}</span>
        </div>

        <dl class="trip-details">
          <div><dt>PICK-UP</dt><dd>${formatDate(booking.pickupDate)}<small>${booking.pickupBranch}</small></dd></div>
          <div><dt>RETURN</dt><dd>${formatDate(booking.returnDate)}<small>${booking.returnCarPark || "Designated car park"}</small></dd></div>
          <div><dt>RENTAL PERIOD</dt><dd>${days} ${days === 1 ? "day" : "days"}<small>$${booking.dailyRate} per day</small></dd></div>
          <div><dt>${isBilled ? "FINAL BILL" : "RENTAL COST"}</dt><dd>${formatMoney(isBilled ? getBillTotal(booking) : days * booking.dailyRate)}<small>${isBilled && booking.damage.amount > 0 ? "includes damage charge" : "excl. any damage"}</small></dd></div>
        </dl>

        ${renderProgress(booking.status)}

        <div class="trip-action">${renderAction(booking)}</div>
      </article>`;
  };

  const renderResults = () => {
    const matches = bookings.filter((booking) => shownRefs.includes(booking.ref));

    if (matches.length === 0) {
      const hasBookings = bookings.some((booking) => booking.email === session.email);
      resultsEl.innerHTML = hasBookings
        ? `<div class="no-results">
             <h3>No bookings found</h3>
             <p>You can only look up bookings made with your account. Check the reference or email address and try again.</p>
           </div>`
        : `<div class="no-results">
             <h3>You have no bookings yet</h3>
             <p>Reserve a car and it will appear here.</p>
             <a class="button button-primary button-sm" href="booking.html">Reserve a car</a>
           </div>`;
      return;
    }

    resultsEl.innerHTML =
      `<h2 class="results-title">${matches.length} ${matches.length === 1 ? "booking" : "bookings"} found</h2>` +
      matches.map(renderBookingCard).join("");
  };

  // ---------- 5. Lookup form ----------
  lookupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Check again at the moment of searching: the person may have logged out in another tab
    const account = AZoomAuth.getSession();
    if (!account || account.role !== "customer") {
      window.location.replace("login.html?next=my-trips.html");
      return;
    }
    bookings = AZoomBookings.load();

    const ref = refInput.value.trim().toUpperCase();
    const email = emailInput.value.trim().toLowerCase();
    lookupMessage.textContent = "";

    if (!ref && !email) {
      lookupMessage.textContent = "Enter a booking reference or an email address.";
      resultsEl.innerHTML = "";
      return;
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      lookupMessage.textContent = "Enter a valid email address, like john@example.com.";
      resultsEl.innerHTML = "";
      return;
    }

    // Only bookings made with this account can be found (a reference or email that belongs
    // to somebody else finds nothing, and looks the same as a booking that does not exist)
    const mine = bookings.filter((booking) => booking.email === account.email);
    shownRefs = mine
      .filter((booking) => (ref && booking.ref === ref) || (email && booking.email === email))
      .map((booking) => booking.ref);
    renderResults();
  });

  resetDemoButton.addEventListener("click", () => {
    bookings = AZoomBookings.reset();
    reviews = AZoomReviews.reset();
    shownRefs = [];
    resultsEl.innerHTML = "";
    lookupMessage.textContent = "";
    lookupForm.reset();
  });

  // ---------- 6. Buttons inside the result cards ----------
  resultsEl.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    bookings = AZoomBookings.load();      // use the latest data (staff may have changed the booking)
    reviews = AZoomReviews.load();
    activeBooking = bookings.find((booking) => booking.ref === button.dataset.ref);
    if (!activeBooking || activeBooking.email !== session.email) return;

    // Each button only works at its own stage of the rental (a stale page cannot skip a step)
    const stageFor = { return: "active", pay: "inspected", review: "paid" };
    if (activeBooking.status !== stageFor[button.dataset.action]) {
      renderResults();
      return;
    }

    if (button.dataset.action === "return") openReturnDialog();
    if (button.dataset.action === "pay") openPayDialog();
    if (button.dataset.action === "review") openReviewDialog();
  });

  // Before returning a car or paying, the person must still be the customer who owns the booking
  const stillOwner = () => {
    const account = AZoomAuth.getSession();
    if (!account || account.role !== "customer" || !activeBooking || activeBooking.email !== account.email) {
      window.location.replace("login.html?next=my-trips.html");
      return false;
    }
    return true;
  };

  // The booking must still be at the stage this step is for (staff may have changed it in the meantime)
  const stillAt = (stage) => {
    bookings = AZoomBookings.load();
    const current = bookings.find((item) => item.ref === activeBooking.ref);
    if (!current || current.status !== stage) {
      document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
      renderResults();
      return false;
    }
    activeBooking = current;
    return true;
  };

  // Every dialog button marked data-close shuts its dialog
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target.closest("[data-close]")) dialog.close();
    });
  });

  // ---------- 7. Return the car ----------
  const openReturnDialog = () => {
    returnForm.reset();
    returnMessage.textContent = "";
    returnCarName.textContent = `${activeBooking.carName} \u00B7 Booking ${activeBooking.ref}`;
    returnDialog.showModal();
  };

  returnForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!stillOwner() || !stillAt("active")) return;

    if (!returnCarPark.value) {
      returnMessage.textContent = "Choose the car park where you left the car.";
      return;
    }
    if (!returnConfirm.checked) {
      returnMessage.textContent = "Please confirm you have parked and locked the car.";
      return;
    }

    activeBooking.status = "returned";
    activeBooking.returnCarPark = returnCarPark.value;
    saveBookings();
    returnDialog.close();
    renderResults();
  });

  // ---------- 8. Pay the final bill ----------
  const openPayDialog = () => {
    payForm.reset();
    payMessage.textContent = "";
    [cardName, cardNumber, cardExpiry, cardCvv].forEach((input) => input.removeAttribute("aria-invalid"));
    payView.hidden = false;
    paySuccess.hidden = true;
    payCarName.textContent = `${activeBooking.carName} \u00B7 Booking ${activeBooking.ref}`;

    // Build the bill from the line items
    payBill.innerHTML =
      getBillItems(activeBooking).map((item) => `<div><dt>${item.label}</dt><dd>${formatMoney(item.amount)}</dd></div>`).join("") +
      `<div class="bill-total"><dt>Total</dt><dd>${formatMoney(getBillTotal(activeBooking))}</dd></div>`;

    payDialog.showModal();
  };

  // Tidy the card fields while typing
  cardNumber.addEventListener("input", () => {
    const digits = cardNumber.value.replace(/\D/g, "").slice(0, 16);
    cardNumber.value = digits.replace(/(.{4})/g, "$1 ").trim();
  });

  cardExpiry.addEventListener("input", () => {
    const digits = cardExpiry.value.replace(/\D/g, "").slice(0, 4);
    cardExpiry.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  });

  cardCvv.addEventListener("input", () => {
    cardCvv.value = cardCvv.value.replace(/\D/g, "").slice(0, 4);
  });

  const payError = (input, message) => {
    [cardName, cardNumber, cardExpiry, cardCvv].forEach((field) => field.removeAttribute("aria-invalid"));
    input.setAttribute("aria-invalid", "true");
    payMessage.textContent = message;
    input.focus();
  };

  const isExpired = (expiry) => {
    const [month, year] = expiry.split("/").map(Number);
    // A card works until the end of its expiry month
    return new Date() >= new Date(2000 + year, month, 1);
  };

  payForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!stillOwner() || !stillAt("inspected")) return;
    payMessage.textContent = "";

    if (!cardName.value.trim()) return payError(cardName, "Enter the name on the card.");
    if (!/^\d{16}$/.test(cardNumber.value.replace(/\s/g, ""))) return payError(cardNumber, "Enter a 16-digit card number.");
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry.value)) return payError(cardExpiry, "Enter the expiry date as MM/YY.");
    if (isExpired(cardExpiry.value)) return payError(cardExpiry, "This card has expired.");
    if (!/^\d{3,4}$/.test(cardCvv.value)) return payError(cardCvv, "Enter the 3 or 4 digit CVV.");

    activeBooking.status = "paid";
    activeBooking.paidOn = new Date().toISOString().slice(0, 10);
    saveBookings();

    document.getElementById("pay-success-text").textContent =
      `${formatMoney(getBillTotal(activeBooking))} paid for booking ${activeBooking.ref}. Thank you for renting with AZoom!`;
    payForm.reset();           // card details are cleared and never stored
    payView.hidden = true;
    paySuccess.hidden = false;
    renderResults();
  });

  // ---------- 8b. Reviews (completed trips only) ----------
  const reviewDialog = document.getElementById("review-dialog");
  const reviewForm = document.getElementById("review-form");
  const reviewTitle = document.getElementById("review-title");
  const reviewCar = document.getElementById("review-car");
  const reviewComment = document.getElementById("review-comment");
  const reviewCount = document.getElementById("review-count");
  const reviewMessage = document.getElementById("review-message");
  const reviewDelete = document.getElementById("review-delete");
  const starLabels = reviewForm.querySelectorAll(".star-input label");
  const starInputs = reviewForm.querySelectorAll('input[name="rating"]');

  const chosenRating = () => {
    const checked = reviewForm.querySelector('input[name="rating"]:checked');
    return checked ? Number(checked.value) : 0;
  };
  // Colour the stars up to the chosen (or hovered) rating
  const paintStars = (upTo) => starLabels.forEach((label, index) => label.classList.toggle("is-on", index < upTo));

  starInputs.forEach((input) => input.addEventListener("change", () => {
    paintStars(chosenRating());
    reviewMessage.textContent = "";
  }));
  starLabels.forEach((label, index) => {
    label.addEventListener("mouseenter", () => paintStars(index + 1));
    label.addEventListener("mouseleave", () => paintStars(chosenRating()));
  });
  reviewComment.addEventListener("input", () => { reviewCount.textContent = `${reviewComment.value.length} / 400`; });

  const todayLocal = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  };

  const openReviewDialog = () => {
    if (activeBooking.status !== "paid") return;          // only a completed trip can be reviewed
    const existing = reviewFor(activeBooking.ref);

    reviewForm.reset();
    reviewMessage.textContent = "";
    reviewTitle.textContent = existing ? "Edit your review" : "Review your trip";
    reviewCar.textContent = `${activeBooking.carName} \u00B7 Booking ${activeBooking.ref}`;
    reviewDelete.hidden = !existing;
    if (existing) {
      reviewForm.querySelector(`input[name="rating"][value="${existing.rating}"]`).checked = true;
      reviewComment.value = existing.comment;
    }
    paintStars(chosenRating());
    reviewCount.textContent = `${reviewComment.value.length} / 400`;
    reviewDialog.showModal();
  };

  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!stillOwner()) return;

    // Use the latest data, then check the booking is really this customer's completed trip
    bookings = AZoomBookings.load();
    reviews = AZoomReviews.load();
    const booking = bookings.find((item) => item.ref === activeBooking.ref);
    if (!booking || booking.status !== "paid") {
      reviewMessage.textContent = "You can review a trip once its final bill has been paid.";
      return;
    }
    activeBooking = booking;

    const rating = chosenRating();
    if (!rating) {
      reviewMessage.textContent = "Choose a star rating from 1 to 5.";
      return;
    }

    const account = AZoomAuth.getSession();
    const existing = reviewFor(booking.ref);
    const review = {
      id: existing ? existing.id : `R${Date.now()}`,
      ref: booking.ref,
      email: account.email,
      name: AZoomReviews.displayName(account.name),
      carName: booking.carName,
      rating,
      comment: reviewComment.value.trim().slice(0, 400),
      date: existing ? existing.date : todayLocal()
    };

    // One review per booking: replace the old one, or add the first
    reviews = existing ? reviews.map((item) => (item.ref === booking.ref ? review : item)) : [...reviews, review];
    AZoomReviews.save(reviews);
    reviewDialog.close();
    renderResults();
  });

  reviewDelete.addEventListener("click", () => {
    if (!stillOwner()) return;
    if (!window.confirm("Delete your review? This cannot be undone.")) return;
    reviews = AZoomReviews.load().filter((item) => item.ref !== activeBooking.ref);
    AZoomReviews.save(reviews);
    reviewDialog.close();
    renderResults();
  });

  // ---------- 9. Arriving from another page ----------
  // booking.html can send people here with ?ref=AZ1234AB so their booking opens straight away
  const refFromUrl = new URLSearchParams(window.location.search).get("ref");
  if (refFromUrl) {
    refInput.value = refFromUrl.toUpperCase();
    lookupForm.requestSubmit();
  }

  // Without a reference in the link, show all of the customer's own bookings straight away
  if (!refFromUrl) {
    emailInput.value = session.email;
    lookupForm.requestSubmit();
  }
});

// ======================================================================
// EMPLOYEE PAGE: hand over, record return, inspect, fleet status
// ======================================================================

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("booking-list")) return;   // only runs on the Employee page

  // Staff only: anyone else is sent to the login page
  const session = AZoomAuth.getSession();
  if (!session || session.role !== "employee") {
    window.location.replace("login.html?need=staff&next=employee.html");
    return;
  }
  document.querySelector(".employee-page").classList.add("is-ready");

  // ---------- 1. Data ----------
  // Bookings come from bookings.js (shared with the My Trips page)
  let bookings = AZoomBookings.load();
  const saveBookings = () => AZoomBookings.save(bookings);
  let reviews = AZoomReviews.load();

  // The cars shown in the Fleet Status Overview come from the shared AZOOM_CARS list
  const fleet = AZOOM_CARS.map((car) => ({
    name: `${car.make} ${car.model}`, make: car.make, model: car.model, category: car.category, imageUrl: car.imageUrl
  }));

  // Booking status (as stored) -> what staff see
  const statusInfo = {
    reserved:  { label: "Reserved",  chip: "Reserved",  tone: "blue" },
    active:    { label: "Picked up", chip: "Picked Up", tone: "amber" },
    returned:  { label: "Returned",  chip: "Returned",  tone: "orange" },
    inspected: { label: "Inspected", chip: "Inspected", tone: "purple" },
    paid:      { label: "Completed", chip: "Completed", tone: "green" }
  };
  const statusKeys = Object.keys(statusInfo);

  // ---------- 2. Page elements ----------
  const statsEl = document.getElementById("stats");
  const chipsEl = document.getElementById("filter-chips");
  const listEl = document.getElementById("booking-list");
  const fleetGrid = document.getElementById("fleet-grid");
  const toastEl = document.getElementById("toast");
  const searchInput = document.getElementById("search");
  const sortSelect = document.getElementById("sort");
  const employeeSelect = document.getElementById("employee-select");

  const returnDialog = document.getElementById("return-dialog");
  const returnForm = document.getElementById("return-form");
  const returnSummary = document.getElementById("return-summary");
  const returnCarPark = document.getElementById("return-carpark");
  const returnMessage = document.getElementById("return-message");

  const inspectDialog = document.getElementById("inspect-dialog");
  const inspectForm = document.getElementById("inspect-form");
  const inspectSummary = document.getElementById("inspect-summary");
  const inspectBy = document.getElementById("inspect-by");
  const inspectMessage = document.getElementById("inspect-message");
  const damageFields = document.getElementById("damage-fields");
  const damageNote = document.getElementById("damage-note");
  const damageAmount = document.getElementById("damage-amount");

  // ---------- 3. State ----------
  const filters = { status: "all", search: "", sort: "recent" };
  let activeBooking = null;

  // The signed-in employee comes from the login (the box just shows who it is)
  const currentEmployee = session.name;
  if (![...employeeSelect.options].some((option) => option.value === currentEmployee)) {
    employeeSelect.add(new Option(currentEmployee, currentEmployee));
  }
  employeeSelect.value = currentEmployee;
  employeeSelect.disabled = true;

  // ---------- 4. Helpers ----------
  // Text typed by people is escaped before it goes into the page
  const esc = (text) => String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  const formatDate = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-SG", { day: "numeric", month: "short" });

  const formatDateLong = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });

  let toastTimer;
  const showToast = (message) => {
    toastEl.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastEl.textContent = ""; }, 5000);
  };

  // ---------- 5. Counts: stats cards and filter chips ----------
  // reduce walks through every booking once and tallies each status
  const countBookings = () =>
    bookings.reduce((counts, booking) => {
      counts[booking.status] += 1;
      counts.total += 1;
      return counts;
    }, { reserved: 0, active: 0, returned: 0, inspected: 0, paid: 0, total: 0 });

  const renderStats = (counts) => {
    const cards = [
      { label: "Reserved",  value: counts.reserved,  tone: "blue" },
      { label: "Picked Up", value: counts.active,    tone: "amber" },
      { label: "Returned",  value: counts.returned,  tone: "orange" },
      { label: "Inspected", value: counts.inspected, tone: "purple" },
      { label: "Completed", value: counts.paid,      tone: "green" },
      { label: "Total",     value: counts.total,     tone: "slate" }
    ];
    statsEl.innerHTML = cards.map((card) =>
      `<div class="stat stat-${card.tone}"><strong>${card.value}</strong><span>${card.label}</span></div>`
    ).join("");
  };

  const renderChips = (counts) => {
    const chips = [{ key: "all", text: `All (${counts.total})` }].concat(
      statusKeys.map((key) => ({ key, text: `${statusInfo[key].chip} (${counts[key]})` }))
    );
    chipsEl.innerHTML = chips.map((chip) =>
      `<button type="button" class="chip ${filters.status === chip.key ? "is-active" : ""}" data-status="${chip.key}" aria-pressed="${filters.status === chip.key}">${chip.text}</button>`
    ).join("");
  };

  // ---------- 6. Bookings list ----------
  const sorters = {
    recent: (a, b) => b.pickupDate.localeCompare(a.pickupDate),
    oldest: (a, b) => a.pickupDate.localeCompare(b.pickupDate),
    customer: (a, b) => a.customer.localeCompare(b.customer)
  };

  // filter keeps the bookings that match the chosen status and the search words
  const getVisibleBookings = () =>
    bookings
      .filter((booking) => {
        const matchStatus = filters.status === "all" || booking.status === filters.status;
        const searchText = `${booking.customer} ${booking.email} ${booking.ref} ${booking.carName}`.toLowerCase();
        return matchStatus && searchText.includes(filters.search);
      })
      .sort(sorters[filters.sort]);

  const renderAction = (booking) => {
    switch (booking.status) {
      case "reserved":
        return `<button type="button" class="button button-primary button-sm" data-action="handover" data-ref="${booking.ref}">Hand over car</button>`;
      case "active":
        return `<button type="button" class="button button-primary button-sm" data-action="return" data-ref="${booking.ref}">Record return</button>`;
      case "returned":
        return `<button type="button" class="button button-primary button-sm" data-action="inspect" data-ref="${booking.ref}">Inspect car</button>`;
      case "inspected":
        return `<span>Awaiting payment</span>`;
      default:
        return `<span>Closed</span>`;
    }
  };

  // Extra line under the car name, depending on how far the booking has got
  const renderNote = (booking) => {
    const dates = `${formatDate(booking.pickupDate)} \u2013 ${formatDate(booking.returnDate)}`;
    if (booking.status === "inspected" || booking.status === "paid") {
      const damage = booking.damage.amount > 0
        ? `Damage: ${esc(booking.damage.note)} ($${booking.damage.amount})`
        : "No damage";
      const review = reviews.find((item) => item.ref === booking.ref);
      const reviewText = booking.status === "paid" ? (review ? ` \u00B7 Reviewed \u2605${review.rating}` : " \u00B7 No review yet") : "";
      return `${dates} \u00B7 ${damage}${booking.inspectedBy ? ` \u00B7 by ${esc(booking.inspectedBy)}` : ""}${reviewText}`;
    }
    const handedOver = booking.handedOverBy ? ` \u00B7 handed over by ${esc(booking.handedOverBy)}` : "";
    if (booking.status === "returned") {
      return `${dates} \u00B7 Left at ${esc(booking.returnCarPark)}${handedOver}`;
    }
    return `${dates} \u00B7 ${esc(booking.pickupBranch)}${handedOver}`;
  };

  // map turns each booking into one row of HTML
  const renderList = () => {
    const visible = getVisibleBookings();

    if (visible.length === 0) {
      listEl.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon"><svg class="icon"><use href="#i-filter"/></svg></span>
          <h3>No bookings match</h3>
          <p>Try a different filter or search term.</p>
        </div>`;
      return;
    }

    listEl.innerHTML = visible.map((booking) => {
      const info = statusInfo[booking.status];
      return `
        <article class="booking-row">
          <div>
            <strong>${esc(booking.customer)}</strong>
            <small>${esc(booking.email)}</small>
          </div>
          <div>
            <strong>${esc(booking.carName)}</strong>
            <small>Ref ${esc(booking.ref)} \u00B7 ${renderNote(booking)}</small>
          </div>
          <span class="status status-${info.tone}">${info.label}</span>
          <div class="row-action">${renderAction(booking)}</div>
        </article>`;
    }).join("");
  };

  // ---------- 7. Fleet status ----------
  // A car is Rented while a booking for it is picked up, and needs inspecting once it is returned
  const getCarStatus = (car) => {
    const booking = bookings.find((item) => item.carName === car.name && (item.status === "active" || item.status === "returned"));
    if (!booking) return { label: "Available", tone: "green" };
    return booking.status === "active" ? { label: "Rented", tone: "amber" } : { label: "Inspection due", tone: "purple" };
  };

  const renderFleet = () => {
    fleetGrid.innerHTML = fleet.map((car) => {
      const status = getCarStatus(car);
      return `
        <div class="fleet-item">
          <span class="thumb">
            <svg class="icon"><use href="#i-car"/></svg>
            <img src="${car.imageUrl}" alt="" loading="lazy" onerror="this.remove()">
          </span>
          <div class="car-info">
            <strong>${car.model}</strong>
            <small>${car.make} \u00B7 ${car.category}</small>
          </div>
          <span class="status status-${status.tone}">${status.label}</span>
        </div>`;
    }).join("");
  };

  // ---------- 7b. Customer reviews ----------
  const reviewListEl = document.getElementById("review-list");
  const reviewSummaryEl = document.getElementById("reviews-summary");
  const reviewsMoreEl = document.getElementById("reviews-more");
  let showAllReviews = false;

  const renderReviews = () => {
    const newest = [...reviews].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

    if (newest.length === 0) {
      reviewSummaryEl.textContent = "No reviews yet";
      reviewListEl.innerHTML = `<p class="review-empty">Customers can review a trip once its final bill is paid.</p>`;
      reviewsMoreEl.hidden = true;
      return;
    }

    // reduce adds up all the star ratings
    const average = newest.reduce((sum, review) => sum + review.rating, 0) / newest.length;
    reviewSummaryEl.innerHTML =
      `${AZoomReviews.stars(average)} <strong>${average.toFixed(1)}</strong> average from ${newest.length} ${newest.length === 1 ? "review" : "reviews"}`;

    const shown = showAllReviews ? newest : newest.slice(0, 6);
    reviewListEl.innerHTML = shown.map((review) => AZoomReviews.cardHtml(review, { showCar: true, showRef: true })).join("");
    reviewsMoreEl.hidden = newest.length <= 6;
    reviewsMoreEl.textContent = showAllReviews ? "Show fewer reviews" : `Show all ${newest.length} reviews`;
  };

  reviewsMoreEl.addEventListener("click", () => {
    showAllReviews = !showAllReviews;
    renderReviews();
  });

  // Draw everything that depends on the bookings
  const renderAll = () => {
    reviews = AZoomReviews.load();
    renderReviews();
    const counts = countBookings();
    renderStats(counts);
    renderChips(counts);
    renderList();
    renderFleet();
  };

  // ---------- 8. Filters, search, sort, sign-in ----------
  chipsEl.addEventListener("click", (event) => {
    const chip = event.target.closest("button[data-status]");
    if (!chip) return;
    filters.status = chip.dataset.status;
    renderAll();
  });

  searchInput.addEventListener("input", () => {
    filters.search = searchInput.value.trim().toLowerCase();
    renderList();
  });

  sortSelect.addEventListener("change", () => {
    filters.sort = sortSelect.value;
    renderList();
  });

  // ---------- 9. Row buttons ----------
  listEl.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    bookings = AZoomBookings.load();      // use the latest data (the customer may have changed the booking)
    activeBooking = bookings.find((booking) => booking.ref === button.dataset.ref);
    if (!activeBooking) return;

    // Each button only works at its own stage of the rental
    const action = button.dataset.action;
    const stageFor = { handover: "reserved", return: "active", inspect: "returned" };
    if (activeBooking.status !== stageFor[action]) {
      showToast("That booking has already moved on, so the list was refreshed.");
      renderAll();
      return;
    }

    if (action === "handover") handOverCar();
    if (action === "return") openReturnDialog();
    if (action === "inspect") openInspectDialog();
  });

  // Every button marked data-close shuts its dialog
  document.querySelectorAll("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target.closest("[data-close]")) dialog.close();
    });
  });

  // The booking must still be at the stage this step is for (the customer may have moved it on)
  const stillAt = (stage) => {
    bookings = AZoomBookings.load();
    const current = bookings.find((item) => item.ref === activeBooking.ref);
    if (!current || current.status !== stage) {
      document.querySelectorAll("dialog[open]").forEach((dialog) => dialog.close());
      showToast("That booking has already moved on, so the list was refreshed.");
      renderAll();
      return false;
    }
    activeBooking = current;
    return true;
  };

  // Reserved -> Picked up (the customer collects the car at the office)
  const handOverCar = () => {
    activeBooking.status = "active";
    activeBooking.handedOverBy = currentEmployee;
    saveBookings();
    showToast(`${activeBooking.carName} handed over to ${activeBooking.customer} (booking ${activeBooking.ref}).`);
    renderAll();
  };

  // ---------- 10. Record return (Picked up -> Returned) ----------
  const openReturnDialog = () => {
    returnForm.reset();
    returnMessage.textContent = "";
    returnSummary.textContent = `${activeBooking.carName} \u00B7 ${activeBooking.customer} \u00B7 Booking ${activeBooking.ref}`;
    returnDialog.showModal();
  };

  returnForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!stillAt("active")) return;
    if (!returnCarPark.value) {
      returnMessage.textContent = "Choose the car park where the car was left.";
      return;
    }
    activeBooking.status = "returned";
    activeBooking.returnCarPark = returnCarPark.value;
    saveBookings();
    returnDialog.close();
    showToast(`Return recorded for booking ${activeBooking.ref}. The car is ready for inspection.`);
    renderAll();
  });

  // ---------- 11. Inspect (Returned -> Inspected) ----------
  const openInspectDialog = () => {
    inspectForm.reset();
    inspectMessage.textContent = "";
    damageFields.hidden = true;
    inspectSummary.textContent = `${activeBooking.carName} \u00B7 left at ${activeBooking.returnCarPark} \u00B7 Booking ${activeBooking.ref}`;
    inspectBy.textContent = `Inspected by ${currentEmployee}`;
    inspectDialog.showModal();
  };

  // Show the damage fields only when "Damage found" is chosen
  inspectForm.addEventListener("change", (event) => {
    if (event.target.name === "result") {
      damageFields.hidden = event.target.value !== "damage";
      inspectMessage.textContent = "";
    }
  });

  inspectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!stillAt("returned")) return;
    const damageFound = inspectForm.elements.result.value === "damage";
    let damage = { amount: 0, note: "" };

    if (damageFound) {
      const note = damageNote.value.trim();
      const amount = Number(damageAmount.value);
      if (!note) {
        inspectMessage.textContent = "Describe the damage you found.";
        damageNote.focus();
        return;
      }
      if (!Number.isFinite(amount) || amount < 1 || amount > 5000) {
        inspectMessage.textContent = "Enter a damage charge between $1 and $5000.";
        damageAmount.focus();
        return;
      }
      damage = { amount: Math.round(amount), note };
    }

    activeBooking.status = "inspected";
    activeBooking.damage = damage;
    activeBooking.inspectedBy = currentEmployee;
    saveBookings();
    inspectDialog.close();
    showToast(damageFound
      ? `Inspection saved for ${activeBooking.ref}: damage charge of $${damage.amount}. The customer can now pay the final bill.`
      : `Inspection saved for ${activeBooking.ref}: no damage. The customer can now pay the final bill.`);
    renderAll();
  });

  // ---------- 12. First draw ----------
  renderAll();
});

// ======================================================================
// BOOKING PAGE: choose a car and dates, pay by credit card, create a booking
// ======================================================================

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("booking-form")) return;   // only runs on the booking page

  // Accounts only: log in (or sign up) before reserving a car
  const session = AZoomAuth.getSession();
  if (!session || session.role !== "customer") {
    const here = window.location.pathname.split("/").pop() + window.location.search;
    window.location.replace(`login.html?next=${encodeURIComponent(here)}${session ? "&need=customer" : ""}`);
    return;
  }
  document.querySelector(".booking-page").classList.add("is-ready");

  // ---------- 1. Rental periods ----------
  // Daily, weekly or monthly rentals (from the brief). Longer rentals get a discount.
  const periods = {
    daily:   { label: "Daily",   unit: "day",   days: 1,  discount: 0,   max: 6 },
    weekly:  { label: "Weekly",  unit: "week",  days: 7,  discount: 0.1, max: 3 },
    monthly: { label: "Monthly", unit: "month", days: 30, discount: 0.2, max: 3 }
  };

  // ---------- 2. Page elements ----------
  const form = document.getElementById("booking-form");
  const carSelect = document.getElementById("car");
  const periodRadios = form.querySelectorAll('input[name="period"]');
  const quantityLabel = document.getElementById("quantity-label");
  const quantityInput = document.getElementById("quantity");
  const pickupDate = document.getElementById("pickup-date");
  const pickupLocation = document.getElementById("pickup-location");
  const returnDateText = document.getElementById("return-date-text");
  const fullName = document.getElementById("full-name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const cardName = document.getElementById("card-name");
  const cardNumber = document.getElementById("card-number");
  const cardExpiry = document.getElementById("card-expiry");
  const cardCvv = document.getElementById("card-cvv");
  const agree = document.getElementById("agree");
  const message = document.getElementById("booking-message");
  const summaryEl = document.getElementById("summary");

  const bookingHead = document.getElementById("booking-head");
  const bookingView = document.getElementById("booking-view");
  const confirmation = document.getElementById("confirmation");

  // ---------- 3. Helpers ----------
  const esc = (text) => String(text).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const formatMoney = (amount) => `$${amount.toLocaleString("en-SG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatDate = (iso) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-SG", { day: "numeric", month: "short", year: "numeric" });

  // Dates are kept as "YYYY-MM-DD" text, so they can be compared directly
  const toISO = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const addDays = (iso, days) => {
    const date = new Date(`${iso}T00:00:00`);
    date.setDate(date.getDate() + days);
    return toISO(date);
  };

  const today = toISO(new Date());
  const lastBookableDate = addDays(today, 365);
  pickupDate.min = today;
  pickupDate.max = lastBookableDate;
  pickupDate.value = today;

  const getPeriodKey = () => form.querySelector('input[name="period"]:checked').value;

  // ---------- 4. Car list ----------
  // Only cars that are not out on rental right now can be booked
  const bookableCars = AZOOM_CARS.filter((car) => car.isAvailable).sort((a, b) => a.dailyRate - b.dailyRate);

  carSelect.insertAdjacentHTML("beforeend", bookableCars.map((car) =>
    `<option value="${car.id}">${car.make} ${car.model} \u00B7 ${car.category} \u00B7 $${car.dailyRate}/day</option>`
  ).join(""));

  // A link like booking.html?car=C007 (from the Fleet page) picks the car straight away
  const carFromUrl = new URLSearchParams(window.location.search).get("car");
  if (carFromUrl) {
    const wanted = AZOOM_CARS.find((car) => car.id === carFromUrl);
    if (wanted && wanted.isAvailable) {
      carSelect.value = wanted.id;
    } else if (wanted) {
      message.textContent = `${wanted.make} ${wanted.model} is out on rental right now. Please choose another car.`;
    }
  }

  // ---------- 5. Working out the price ----------
  const getSelection = () => {
    const car = AZOOM_CARS.find((item) => item.id === carSelect.value);
    if (!car) return null;

    const period = periods[getPeriodKey()];
    const quantity = Number(quantityInput.value);
    const quantityOk = Number.isInteger(quantity) && quantity >= 1 && quantity <= period.max;
    const dateOk = /^\d{4}-\d{2}-\d{2}$/.test(pickupDate.value) && pickupDate.value >= today && pickupDate.value <= lastBookableDate;

    const days = quantityOk ? quantity * period.days : 0;
    const rate = Math.round(car.dailyRate * (1 - period.discount));   // whole-dollar rate after discount
    return {
      car, period, quantity, quantityOk, dateOk, days, rate,
      fullPrice: days * car.dailyRate,
      total: days * rate,
      returnDate: dateOk && quantityOk ? addDays(pickupDate.value, days) : null
    };
  };

  // Is the car already booked for any of these dates?
  // Reserved, picked-up and returned bookings still hold the car.
  const findConflict = (selection) => {
    if (!selection || !selection.returnDate) return null;
    const carName = `${selection.car.make} ${selection.car.model}`;
    return bookings.find((booking) =>
      booking.carName === carName &&
      ["reserved", "active", "returned"].includes(booking.status) &&
      pickupDate.value < booking.returnDate &&
      selection.returnDate > booking.pickupDate
    ) || null;
  };

  let bookings = AZoomBookings.load();

  // ---------- 6. Live summary ----------
  const summaryRows = (selection) => {
    const periodText = `${selection.quantity} ${selection.period.unit}${selection.quantity === 1 ? "" : "s"} (${selection.days} ${selection.days === 1 ? "day" : "days"})`;
    const rows = [
      { label: "Rental period", value: selection.quantityOk ? periodText : "\u2013" },
      { label: "Pick-up", value: selection.dateOk ? formatDate(pickupDate.value) : "\u2013" },
      { label: "Return by", value: selection.returnDate ? formatDate(selection.returnDate) : "\u2013" },
      { label: "Daily rate", value: `$${selection.rate}${selection.period.discount > 0 ? ` (was $${selection.car.dailyRate})` : ""}` }
    ];
    return rows;
  };

  const renderSummary = () => {
    const selection = getSelection();

    // Return date shown next to the form fields
    returnDateText.textContent = selection && selection.returnDate ? formatDate(selection.returnDate) : "Choose a pick-up date";

    if (!selection) {
      summaryEl.innerHTML = `<p class="summary-empty">Choose a car to see your price.</p>`;
      return;
    }

    const conflict = findConflict(selection);
    const saving = selection.fullPrice - selection.total;

    summaryEl.innerHTML = `
      <div class="summary-car">
        <span class="thumb">
          <svg class="icon"><use href="#i-car"/></svg>
          <img src="${selection.car.imageUrl}" alt="" onerror="this.remove()">
        </span>
        <div>
          <strong>${selection.car.make} ${selection.car.model}</strong>
          <small>${selection.car.category} \u00B7 ${selection.car.seats} seats \u00B7 ${selection.car.rangeKm} km range</small>
        </div>
      </div>
      ${conflict ? `<p class="summary-warning">Already booked from ${formatDate(conflict.pickupDate)} to ${formatDate(conflict.returnDate)}. Choose other dates or another car.</p>` : ""}
      <dl class="bill">
        ${summaryRows(selection).map((row) => `<div><dt>${row.label}</dt><dd>${row.value}</dd></div>`).join("")}
        ${saving > 0 ? `<div class="bill-saving"><dt>${selection.period.label} discount (${selection.period.discount * 100}%)</dt><dd>\u2212${formatMoney(saving)}</dd></div>` : ""}
        <div class="bill-total"><dt>Estimated total</dt><dd>${selection.quantityOk ? formatMoney(selection.total) : "\u2013"}</dd></div>
      </dl>
      <p class="summary-note">A credit card hold is placed now. You are charged after your trip, once the car has been inspected. Any damage found is added to the final bill.</p>`;
  };

  // Changing the period updates the quantity label and its limits
  const updateQuantityField = () => {
    const period = periods[getPeriodKey()];
    quantityLabel.textContent = `NUMBER OF ${period.unit.toUpperCase()}S`;
    quantityInput.max = period.max;
    if (Number(quantityInput.value) > period.max) quantityInput.value = period.max;
  };

  periodRadios.forEach((radio) => radio.addEventListener("change", updateQuantityField));

  // Anything the person changes refreshes the summary and clears an old error
  const clearInvalid = (target) => {
    if (target && target.removeAttribute) target.removeAttribute("aria-invalid");
    message.textContent = "";
  };
  form.addEventListener("input", (event) => { clearInvalid(event.target); renderSummary(); });
  form.addEventListener("change", (event) => { clearInvalid(event.target); renderSummary(); });

  // ---------- 7. Tidy the card fields while typing ----------
  cardNumber.addEventListener("input", () => {
    const digits = cardNumber.value.replace(/\D/g, "").slice(0, 16);
    cardNumber.value = digits.replace(/(.{4})/g, "$1 ").trim();
  });
  cardExpiry.addEventListener("input", () => {
    const digits = cardExpiry.value.replace(/\D/g, "").slice(0, 4);
    cardExpiry.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  });
  cardCvv.addEventListener("input", () => {
    cardCvv.value = cardCvv.value.replace(/\D/g, "").slice(0, 4);
  });

  // ---------- 8. Checking the form and making the booking ----------
  const fail = (input, text) => {
    input.setAttribute("aria-invalid", "true");
    message.textContent = text;
    input.focus();
  };

  const isExpired = (expiry) => {
    const [month, year] = expiry.split("/").map(Number);
    // A card works until the end of its expiry month
    return new Date() >= new Date(2000 + year, month, 1);
  };

  // A short code like AZ7K29D4 that is not already used (no 0, O, 1 or I, which look alike)
  const makeRef = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let ref;
    do {
      ref = "AZ" + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    } while (bookings.some((booking) => booking.ref === ref));
    return ref;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Check again at the moment of booking: the person may have logged out in another tab
    const account = AZoomAuth.getSession();
    if (!account || account.role !== "customer") {
      window.location.replace("login.html?next=booking.html");
      return;
    }

    bookings = AZoomBookings.load();      // use the latest bookings, in case another page changed them
    message.textContent = "";

    const selection = getSelection();
    if (!selection) return fail(carSelect, "Choose the car you would like to rent.");
    if (!selection.dateOk) return fail(pickupDate, `Choose a pick-up date from today up to ${formatDate(lastBookableDate)}.`);
    if (!selection.quantityOk) return fail(quantityInput, `Enter a number of ${selection.period.unit}s between 1 and ${selection.period.max}.`);

    const conflict = findConflict(selection);
    if (conflict) {
      return fail(pickupDate, `${selection.car.make} ${selection.car.model} is already booked from ${formatDate(conflict.pickupDate)} to ${formatDate(conflict.returnDate)}. Choose other dates or another car.`);
    }

    if (!pickupLocation.value) return fail(pickupLocation, "Choose where you will collect the car.");
    if (fullName.value.trim().length < 2) return fail(fullName, "Enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) return fail(emailInput, "Enter a valid email address, like john@example.com.");
    if (!/^(\+65\s?)?[689]\d{3}\s?\d{4}$/.test(phoneInput.value.trim())) return fail(phoneInput, "Enter a Singapore phone number, like 9123 4567.");

    if (!cardName.value.trim()) return fail(cardName, "Enter the name on the card.");
    if (!/^\d{16}$/.test(cardNumber.value.replace(/\s/g, ""))) return fail(cardNumber, "Enter a 16-digit credit card number.");
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry.value)) return fail(cardExpiry, "Enter the expiry date as MM/YY.");
    if (isExpired(cardExpiry.value)) return fail(cardExpiry, "This card has expired.");
    if (!/^\d{3,4}$/.test(cardCvv.value)) return fail(cardCvv, "Enter the 3 or 4 digit CVV.");

    if (!agree.checked) return fail(agree, "Please agree to the rental terms to continue.");

    // Everything is fine: create the booking (card details are NOT saved)
    const booking = {
      ref: makeRef(),
      customer: account.name,
      email: account.email,
      carName: `${selection.car.make} ${selection.car.model}`,
      dailyRate: selection.rate,
      pickupDate: pickupDate.value,
      returnDate: selection.returnDate,
      pickupBranch: pickupLocation.value,
      status: "reserved",
      returnCarPark: null,
      damage: { amount: 0, note: "" },
      inspectedBy: null,
      paidOn: null
    };
    bookings.push(booking);
    AZoomBookings.save(bookings);

    showConfirmation(booking, selection);
  });

  // ---------- 9. Confirmation screen ----------
  const showConfirmation = (booking, selection) => {
    document.getElementById("confirm-ref").textContent = booking.ref;
    document.getElementById("confirm-text").textContent =
      `Thank you, ${booking.customer}. Collect your ${booking.carName} at the ${booking.pickupBranch} office on ${formatDate(booking.pickupDate)}. Keep your reference handy.`;
    document.getElementById("confirm-trips").href = `my-trips.html?ref=${booking.ref}`;

    const rows = [
      ...summaryRows(selection),
      { label: "Pick-up location", value: esc(booking.pickupBranch) },
      { label: "Estimated total", value: formatMoney(selection.total) }
    ];
    document.getElementById("confirm-bill").innerHTML =
      rows.map((row) => `<div><dt>${row.label}</dt><dd>${row.value}</dd></div>`).join("");

    form.reset();                          // clears the card details
    bookingHead.hidden = true;
    bookingView.hidden = true;
    confirmation.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------- 10. The booking is made in the logged-in customer's name ----------
  // Name and email come from the account (and cannot be changed here), so every booking
  // belongs to an account and shows up in that customer's My Trips.
  fullName.value = session.name;
  emailInput.value = session.email;
  fullName.readOnly = true;
  emailInput.readOnly = true;
  document.getElementById("account-note-name").textContent = `${session.name} (${session.email})`;

  // ---------- 11. First draw ----------
  updateQuantityField();
  renderSummary();
});

// ======================================================================
// ALL PAGES: the account link in the header, and every "Log out" button
// ======================================================================

document.addEventListener("DOMContentLoaded", () => {
  AZoomAuth.refreshHeader();

  // Any button marked data-logout logs the person out
  document.addEventListener("click", (event) => {
    if (!event.target.closest("[data-logout]")) return;
    AZoomAuth.logout();
    window.location.href = "login.html?out=1";
  });
});

// ======================================================================
// LOGIN PAGE: log in, sign up, account details, change password
// ======================================================================

document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("auth-section")) return;   // only runs on the login page

  // ---------- 1. Page elements ----------
  const params = new URLSearchParams(window.location.search);
  const next = AZoomAuth.safeNext(params.get("next"));    // where to go after logging in

  const messageBox = document.getElementById("message-box");
  const authSection = document.getElementById("auth-section");
  const accountSection = document.getElementById("account-section");
  const pageTitle = document.getElementById("login-title");
  const pageText = document.getElementById("login-sub");

  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const changePassForm = document.getElementById("change-pass-form");

  const loginEmail = document.getElementById("login-email");
  const loginPassword = document.getElementById("login-password");
  const signupName = document.getElementById("signup-name");
  const signupEmail = document.getElementById("signup-email");
  const signupPassword = document.getElementById("signup-password");
  const signupConfirm = document.getElementById("signup-confirm");
  const strengthBar = document.getElementById("strength-bar");
  const strengthText = document.getElementById("strength-text");
  const oldPassword = document.getElementById("old-password");
  const newPassword = document.getElementById("new-password");
  const confirmPassword = document.getElementById("confirm-password");

  // ---------- 2. Helpers ----------
  let messageTimer;
  const showMessage = (text, type = "success") => {
    messageBox.textContent = text;
    messageBox.className = `auth-message ${type}`;
    messageBox.hidden = false;
    clearTimeout(messageTimer);
    messageTimer = setTimeout(() => { messageBox.hidden = true; }, 7000);
  };

  // Shows the problem, marks the field and puts the cursor in it
  const fail = (input, text) => {
    input.setAttribute("aria-invalid", "true");
    showMessage(text, "error");
    input.focus();
  };
  document.querySelectorAll(".auth-form input").forEach((input) => {
    input.addEventListener("input", () => input.removeAttribute("aria-invalid"));
  });

  const setTab = (name) => {
    const isLogin = name === "login";
    tabLogin.setAttribute("aria-selected", isLogin);
    tabSignup.setAttribute("aria-selected", !isLogin);
    loginForm.hidden = !isLogin;
    signupForm.hidden = isLogin;
  };
  tabLogin.addEventListener("click", () => setTab("login"));
  tabSignup.addEventListener("click", () => setTab("signup"));

  // "Show" / "Hide" buttons next to password boxes
  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.target);
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.textContent = show ? "Hide" : "Show";
      button.setAttribute("aria-pressed", show);
    });
  });

  // ---------- 3. Password strength meter ----------
  const scorePassword = (password) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  };

  signupPassword.addEventListener("input", () => {
    const password = signupPassword.value;
    if (!password) {
      strengthBar.style.width = "0";
      strengthBar.className = "";
      strengthText.textContent = "At least 8 characters, with a letter and a number.";
      return;
    }
    const score = scorePassword(password);
    const labels = ["Too weak", "Weak", "Weak", "Okay", "Strong", "Very strong"];
    strengthBar.style.width = `${Math.max(score, 1) * 20}%`;
    strengthBar.className = score <= 2 ? "is-weak" : score === 3 ? "is-ok" : "is-strong";
    strengthText.textContent = `Password strength: ${labels[score]}`;
  });

  // ---------- 4. Which view to show ----------
  const accountLinks = {
    customer: [["my-trips.html", "My Trips"], ["booking.html", "Reserve a car"], ["fleet.html", "Browse fleet"]],
    employee: [["employee.html", "Employee dashboard"], ["fleet.html", "Browse fleet"]]
  };

  const renderAccount = (session) => {
    pageTitle.textContent = "Your account";
    pageText.textContent = "Your details and password.";
    document.getElementById("account-name").textContent = session.name;
    document.getElementById("account-email").textContent = session.email;
    document.getElementById("account-role").textContent = session.role === "employee" ? "Staff" : "Customer";
    document.getElementById("account-links").innerHTML = accountLinks[session.role].map((item, index) =>
      `<a class="button ${index === 0 ? "button-primary" : "button-ghost"} button-sm" href="${item[0]}">${item[1]}</a>`
    ).join("");
  };

  const checkAuthState = () => {
    const session = AZoomAuth.getSession();
    AZoomAuth.refreshHeader();
    authSection.hidden = Boolean(session);
    accountSection.hidden = !session;
    if (session) {
      renderAccount(session);
    } else {
      pageTitle.textContent = "Welcome to AZoom";
      pageText.textContent = "Log in or create an account to book faster and keep track of your trips.";
    }
    return session;
  };

  // What staff are told when they try a customers-only page
  const customerOnlyMessage = (page) => (page.startsWith("my-trips.html")
    ? "My Trips is for customer accounts. Staff accounts can't use it. Please log in with a customer account."
    : "Staff accounts can't make reservations. Please log in with a customer account.");

  // After a successful log in or sign up: go back to where the person came from
  const afterLogin = (session, welcome) => {
    if (next) {
      const staffOnly = next.startsWith("employee.html");        // only staff may open the dashboard
      const customerOnly = next.startsWith("booking.html") || next.startsWith("my-trips.html");   // customers only
      if ((!staffOnly || session.role === "employee") && (!customerOnly || session.role === "customer")) {
        window.location.href = next;
        return;
      }
      checkAuthState();
      showMessage(staffOnly
        ? "That page is for AZoom staff only. You are logged in as a customer."
        : customerOnlyMessage(next), "error");
      return;
    }
    checkAuthState();
    showMessage(welcome, "success");
  };

  // ---------- 5. Log in ----------
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = loginEmail.value.trim();

    if (!AZoomAuth.isEmail(email)) return fail(loginEmail, "Enter the email address you signed up with.");
    if (!loginPassword.value) return fail(loginPassword, "Enter your password.");

    const result = await AZoomAuth.login(email, loginPassword.value);
    if (!result.ok) {
      loginPassword.value = "";
      return fail(loginPassword, result.error);
    }
    loginForm.reset();
    afterLogin(result.session, `Welcome back, ${result.session.name}!`);
  });

  // Quick buttons that fill in the demo accounts
  document.querySelectorAll("[data-demo]").forEach((button) => {
    button.addEventListener("click", () => {
      const demo = AZoomAuth.demoAccounts.find((account) => account.email === button.dataset.demo);
      setTab("login");
      loginEmail.value = demo.email;
      loginPassword.value = demo.password;
      loginPassword.focus();
    });
  });

  // ---------- 6. Sign up ----------
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (signupPassword.value !== signupConfirm.value) {
      return fail(signupConfirm, "The two passwords do not match.");
    }
    const result = await AZoomAuth.register(signupName.value, signupEmail.value, signupPassword.value);
    if (!result.ok) {
      const field = { name: signupName, email: signupEmail, password: signupPassword }[result.field];
      return fail(field, result.error);
    }
    signupForm.reset();
    strengthBar.style.width = "0";
    strengthText.textContent = "At least 8 characters, with a letter and a number.";
    afterLogin(result.session, `Account created. Welcome, ${result.session.name}!`);
  });

  // ---------- 7. Change password ----------
  changePassForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (newPassword.value !== confirmPassword.value) {
      return fail(confirmPassword, "The two new passwords do not match.");
    }
    const result = await AZoomAuth.changePassword(oldPassword.value, newPassword.value);
    if (!result.ok) {
      const field = { current: oldPassword, new: newPassword }[result.field] || oldPassword;
      return fail(field, result.error);
    }
    changePassForm.reset();
    showMessage("Password updated. Use your new password next time you log in.", "success");
  });

  // ---------- 8. Messages from the page that sent the visitor here ----------
  const session = checkAuthState();
  if (params.get("out")) {
    showMessage("You have been logged out.", "success");
  } else if (params.get("need") === "staff") {
    if (session && session.role !== "employee") {
      showMessage("The Employee dashboard is for AZoom staff. You are logged in as a customer.", "error");
    } else if (!session) {
      showMessage("The Employee dashboard is for AZoom staff. Please log in with a staff account.", "info");
    }
  } else if (params.get("need") === "customer" && session) {
    showMessage(customerOnlyMessage(next), "error");
  } else if (next && !session) {
    showMessage(next.startsWith("booking.html")
      ? "Please log in or create an account to reserve a car."
      : next.startsWith("my-trips.html")
        ? "Please log in or create an account to see your trips."
        : "Please log in to continue.", "info");
  }
});

// ======================================================================
// HOME PAGE: what customers say
// ======================================================================

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("home-reviews");
  if (!grid) return;                                      // only runs on the home page

  const reviews = AZoomReviews.load();
  const summary = document.getElementById("home-reviews-summary");

  if (reviews.length === 0) {
    summary.textContent = "Be the first to review a trip.";
    return;
  }

  // reduce adds up all the star ratings
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  summary.innerHTML = `${AZoomReviews.stars(average)} <strong>${average.toFixed(1)}</strong> average from ${reviews.length} customer reviews`;

  // Three of the best recent reviews: five stars, a proper comment, newest first, one per car
  const picked = [];
  const carsSeen = new Set();
  reviews
    .filter((review) => review.rating === 5 && review.comment.length >= 30)
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .forEach((review) => {
      if (picked.length < 3 && !carsSeen.has(review.carName)) {
        carsSeen.add(review.carName);
        picked.push(review);
      }
    });
  grid.innerHTML = picked.map((review) => AZoomReviews.cardHtml(review, { showCar: true })).join("");
});
