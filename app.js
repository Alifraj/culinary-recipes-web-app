

// --- 1. DONNÉES ET ÉTAT GLOBAL ---

// Les données de recettes originales (immuables)
const RECIPES = [
    {
        id: 1,
        name: "Poulet Tandoori Rapide",
        description: "Un classique indien, prêt en moins de 30 minutes.",
        ingredients: ["poulet", "yaourt", "épices tandoori", "citron"],
        difficulty: "Facile",
        time: 30,
        category: "Plats Principaux",
        image: "./assets/tandori.png"
    },
    {
        id: 2,
        name: "Mousse au Chocolat Intense",
        description: "Légère, aérienne et riche en cacao.",
        ingredients: ["chocolat noir", "oeufs", "sucre", "beurre"],
        difficulty: "Intermédiaire",
        time: 45,
        category: "Desserts",
        image: "./assets/mousseauchocolat.png"
    },
    {
        id: 3,
        name: "Salade Quinoa et Avocat",
        description: "Une entrée végétarienne fraîche, saine et pleine de saveurs.",
        ingredients: ["quinoa", "avocat", "tomates", "concombre", "feta"],
        difficulty: "Facile",
        time: 15,
        category: "Entrées",
        image: "./assets/salade.png"
    },
    {
        id: 4,
        name: "Pâtes Carbonara Authentiques",
        description: "La vraie recette romaine, sans crème !",
        ingredients: ["pâtes", "guanciale", "jaune d'oeuf", "pecorino romano"],
        difficulty: "Intermédiaire",
        time: 25,
        category: "Plats Principaux",
        image: "./assets/pates.png"
    },
    {
        id: 5,
        name: "Tarte aux Légumes de Saison",
        description: "Une tarte saine, facile et parfaite pour le dîner.",
        ingredients: ["pâte brisée", "courgettes", "poivrons", "oeufs", "crème"],
        difficulty: "Facile",
        time: 40,
        category: "Végétarien",
        image: "./assets/tarte.png"
    },
    {
        id: 6,
        name: "Soufflé au Fromage",
        description: "Classique français, demande de la précision.",
        ingredients: ["oeufs", "gruyère", "farine", "lait"],
        difficulty: "Difficile",
        time: 60,
        category: "Entrées",
        image: "./assets/souffle.png"
    },
    {
        id: 7,
        name: "Gâteau Forêt Noire",
        description: "Un dessert riche en cerises et chocolat.",
        ingredients: ["chocolat", "crème", "cerises", "kirsch"],
        difficulty: "Difficile",
        time: 180,
        category: "Desserts",
        image: "./assets/gateau.png"
    },
    {
        id: 8,
        name: "Curry de Pois Chiches",
        description: "Recette végétarienne simple et parfumée.",
        ingredients: ["pois chiches", "tomates", "lait de coco", "curry"],
        difficulty: "Facile",
        time: 45,
        category: "Végétarien",
        image: "./assets/Curry de Pois Chiches.png"
    },
    {
        id: 9,
        name: "Crème brûlée",
        description: "Dessert croustillant et onctueux à la vanille.",
        ingredients: ["crème", "jaune d'oeuf", "sucre", "vanille"],
        difficulty: "Intermédiaire",
        time: 90,
        category: "Desserts",
        image: "./assets/creme.png"
    },
    {
        id: 10,
        name: "Burger Maison Deluxe",
        description: "Le classique américain revisité avec des ingrédients frais.",
        ingredients: ["pain", "viande hachée", "fromage", "oignon", "tomate"],
        difficulty: "Facile",
        time: 20,
        category: "Plats Principaux",
        image: "./assets/burger.png"
    }
];

// --- Gestion de la Persistance (Local Storage) ---

function loadUserRecipes() {
    try {
        const userRecipesString = localStorage.getItem('userRecipes');
        return userRecipesString ? JSON.parse(userRecipesString) : [];
    } catch (e) {
        console.error("Erreur lors du chargement des recettes utilisateur:", e);
        return [];
    }
}

/** Sauvegarde le tableau de recettes utilisateur dans le Local Storage. */
function saveUserRecipes(recipes) {
    try {
        localStorage.setItem('userRecipes', JSON.stringify(recipes));
    } catch (e) {
        console.error("Erreur lors de la sauvegarde des recettes utilisateur:", e);
    }
}

/** Ajoute une nouvelle recette au Local Storage. */
function addUserRecipe(newRecipe) {
    const userRecipes = loadUserRecipes();
    userRecipes.push(newRecipe);
    saveUserRecipes(userRecipes);
}

// L'ensemble complet des recettes (Originales + Utilisateur, chargé au démarrage)
let ALL_RECIPES = [...RECIPES, ...loadUserRecipes()];

// Références DOM communes
const recipesGrid = document.querySelector('.recipes-grid');
const searchInput = document.getElementById('recipe-search');

// État Global pour la Page Recettes (pour le Filtrage et la Pagination)
const ITEMS_PER_PAGE = 5; 
let currentPage = 1;
// Utilise ALL_RECIPES par défaut
let currentFilteredRecipes = ALL_RECIPES; 

// État Global pour la Page Ajouter une Recette (Aperçu d'image)
let currentRecipeImageUrl = './assets/placeholder.png'; 


// --- 2. FONCTIONS DE RENDU (Affichage) ---

// --- 2. FONCTIONS DE RENDU (Affichage) ---

function createRecipeCard(recipe) {
    return `
        <article class="recipe-card">
            <img src="${recipe.image}" alt="Image de ${recipe.name}">
            <h3>${recipe.name}</h3>
            <p class="description">${recipe.description}</p>
            <div class="meta">
                <span class="difficulty">${recipe.difficulty}</span>
                <span class="time">${recipe.time} min</span>
            </div>
            <a href="recette-detail.html?id=${recipe.id}" class="details-link">Voir la recette</a> 
        </article>
    `;
}


function renderRecipes(recipesToShow) {
    if (!recipesGrid) return;

    if (recipesToShow.length === 0) {
        recipesGrid.innerHTML = '<p class="no-results">Aucune recette trouvée correspondant à votre sélection. 🙁</p>';
        return;
    }

    const cardsHtml = recipesToShow.map(createRecipeCard).join('');
    recipesGrid.innerHTML = cardsHtml;
}




function filterHomePageRecipes(query) {
    const lowerCaseQuery = query.toLowerCase().trim();

    // Utilisation de ALL_RECIPES
    if (lowerCaseQuery.length === 0) {
        renderRecipes(ALL_RECIPES.slice(0, 3)); 
        return;
    }

    const filtered = ALL_RECIPES.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(lowerCaseQuery);
        const ingredientsMatch = Array.isArray(recipe.ingredients) && recipe.ingredients.some(ingredient => 
            ingredient.toLowerCase().includes(lowerCaseQuery)
        );
        return nameMatch || ingredientsMatch;
    });

    renderRecipes(filtered.slice(0, 3)); 
}

function initializeHomePage() {
    if (!searchInput) return;
    
    filterHomePageRecipes(searchInput.value || ''); 

    searchInput.addEventListener('input', (event) => {
        filterHomePageRecipes(event.target.value);
    });
    
    const searchButton = document.querySelector('.search-container button');
    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault();
            filterHomePageRecipes(searchInput.value);
        });
    }
}


// --- 4. LOGIQUE SPÉCIFIQUE À LA PAGE RECETTES (recettes.html) ---

function applyFilters() {
    const category = document.getElementById('filter-category').value;
    const difficultyRadio = document.querySelector('input[name="difficulty"]:checked');
    const difficulty = difficultyRadio ? difficultyRadio.value : 'all';
    const maxTime = parseInt(document.getElementById('filter-time').value, 10);
    
    // Filtrer le tableau ALL_RECIPES
    let filtered = ALL_RECIPES.filter(recipe => {
        const categoryMatch = category === 'all' || recipe.category === category;
        const difficultyMatch = difficulty === 'all' || recipe.difficulty === difficulty;
        const timeMatch = recipe.time <= maxTime;

        return categoryMatch && difficultyMatch && timeMatch;
    });

    currentFilteredRecipes = filtered;
    currentPage = 1; 
}

function renderCurrentPage() {
    if (!recipesGrid) return;
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    const recipesToRender = currentFilteredRecipes.slice(startIndex, endIndex);

    renderRecipes(recipesToRender);
    renderPaginationControls();
}

function renderPaginationControls() {
    const totalItems = currentFilteredRecipes.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    const pageInfo = document.getElementById('page-info');

    if (!prevBtn || !nextBtn || !pageInfo) return; 

    pageInfo.textContent = `Page ${totalPages > 0 ? currentPage : 0} de ${totalPages}`;

    prevBtn.disabled = currentPage <= 1; 
    nextBtn.disabled = currentPage >= totalPages;
}

function initializeRecipesPage() {
    if (!document.querySelector('.all-recipes-page')) {
        return;
    }
    
    currentFilteredRecipes = ALL_RECIPES;
    currentPage = 1;
    renderCurrentPage();

    const timeInput = document.getElementById('filter-time');
    const timeValueSpan = document.getElementById('time-value');
    if (timeInput && timeValueSpan) {
        timeValueSpan.textContent = `${timeInput.value} min`; 
        timeInput.addEventListener('input', (e) => {
            timeValueSpan.textContent = `${e.target.value} min`;
        });
    }

    const applyBtn = document.getElementById('apply-filters-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            applyFilters();
            renderCurrentPage(); 
        });
    }

    const resetBtn = document.getElementById('reset-filters-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.getElementById('filter-category').value = 'all';
            const diffAll = document.getElementById('diff-all');
            if(diffAll) diffAll.checked = true;
            if(timeInput) timeInput.value = 60; 
            if(timeValueSpan) timeValueSpan.textContent = `60 min`;
            
            applyFilters(); 
            renderCurrentPage();
        });
    }

    document.getElementById('prev-page-btn')?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderCurrentPage();
        }
    });

    document.getElementById('next-page-btn')?.addEventListener('click', () => {
        const totalPages = Math.ceil(currentFilteredRecipes.length / ITEMS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            renderCurrentPage();
        }
    });
}


// --- 5. LOGIQUE SPÉCIFIQUE À LA PAGE AJOUTER UNE RECETTE (ajouter.html) ---

/**
 * Lit un objet File et le convertit en chaîne Base64.
 * @param {File} file - L'objet fichier image.
 * @returns {Promise<string>} 
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function clearAllErrors() {
    document.querySelectorAll('.error-text').forEach(el => {
        el.textContent = '';
    });
    document.querySelectorAll('.form-group.error').forEach(el => {
        el.classList.remove('error');
    });
}

function displayError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorElement = document.getElementById(inputId + '-error');
    
    let formGroup;

    if (input) {
        formGroup = input.closest('.form-group');
    } else if (inputId === 'difficulty') {
        formGroup = document.getElementById('difficulty-error')?.closest('.form-group');
    } else {
        formGroup = null;
    }

    if (errorElement) {
        errorElement.textContent = message;
    }
    
    if (formGroup) {
        if (message) {
            formGroup.classList.add('error');
        } else {
            formGroup.classList.remove('error');
        }
    }
}

/**
 * 5.2. LOGIQUE DE VALIDATION DU FORMULAIRE
 */
function validateAddRecipeForm() {
    let isValid = true;
    
    const name = document.getElementById('recipe-name').value.trim();
    const description = document.getElementById('recipe-description').value.trim();
    const time = document.getElementById('recipe-time').value;
    const category = document.getElementById('recipe-category').value;
    const difficulty = document.querySelector('input[name="add-difficulty"]:checked')?.value || '';
    const ingredients = document.getElementById('recipe-ingredients').value.trim();
    const imageFile = document.getElementById('recipe-image-file').files[0];
    
    // ... (Validations 1 à 6 inchangées)

    // 7. Validation du Fichier Image (obligatoire et type)
    if (!imageFile) {
        displayError('recipe-image-file', 'Veuillez sélectionner un fichier image.');
        isValid = false;
    } else {
        if (!imageFile.type.startsWith('image/')) {
             displayError('recipe-image-file', 'Le fichier doit être une image (png, jpg, webp).');
             isValid = false;
        } else {
            displayError('recipe-image-file', '');
        }
    }

    return isValid;
}

/**
 * 5.3. INITIALISATION DE LA PAGE D'AJOUT DE RECETTE
 */
function initializeAddRecipePage() {
    const form = document.getElementById('add-recipe-form');
    const messageBox = document.getElementById('form-message');

    if (!form) return;
    
    const imageInput = document.getElementById('recipe-image-file');
    const imagePreview = document.getElementById('image-preview');

    // Événement : Affichage de l'aperçu de l'image (utilise URL temporaire pour la vitesse)
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            
            if (file) {
                const tempUrl = URL.createObjectURL(file);
                imagePreview.src = tempUrl;
                imagePreview.classList.remove('hidden');
                displayError('recipe-image-file', ''); 
                // Note: currentRecipeImageUrl est désormais facultatif ici, mais l'URL temp est utilisée pour l'aperçu.
            } else {
                imagePreview.src = '';
                imagePreview.classList.add('hidden');
            }
        });
    }

    // Événement : Soumission du formulaire (MAIN FIX: Rendre asynchrone pour la conversion Base64)
    form.addEventListener('submit', async (e) => { 
        e.preventDefault(); 
        
        clearAllErrors();
        messageBox.classList.add('hidden');
        messageBox.classList.remove('success', 'error-summary');
        
        const isFormValid = validateAddRecipeForm();

        if (isFormValid) {
            
            const imageFile = document.getElementById('recipe-image-file').files[0];
            let base64ImageString = '';

            try {
                // Étape 1: Conversion du fichier en Base64 (opération asynchrone)
                messageBox.textContent = 'Chargement de l\'image en cours... Veuillez patienter.';
                messageBox.classList.remove('hidden');
                
                base64ImageString = await fileToBase64(imageFile); // ATTEND la conversion
                
            } catch (error) {
                console.error("Erreur de conversion Base64:", error);
                messageBox.textContent = '❌ Erreur lors du traitement de l\'image.';
                messageBox.classList.remove('success');
                messageBox.classList.add('error-summary');
                return; // Arrête la soumission
            }
            
            // Étape 2: Création de l'objet recette avec la chaîne Base64
            const newRecipeData = {
                id: Math.max(...ALL_RECIPES.map(r => r.id), 0) + 1, 
                name: document.getElementById('recipe-name').value.trim(),
                description: document.getElementById('recipe-description').value.trim(),
                time: parseInt(document.getElementById('recipe-time').value, 10),
                category: document.getElementById('recipe-category').value,
                difficulty: document.querySelector('input[name="add-difficulty"]:checked').value,
                ingredients: document.getElementById('recipe-ingredients').value.trim().split(',').map(s => s.trim()),
                image: base64ImageString, // STOCKAGE PERSISTANT (Base64)
            };
            
            // Étape 3: Sauvegarde
            addUserRecipe(newRecipeData);
            ALL_RECIPES.push(newRecipeData);
            
            console.log("Recette ajoutée avec succès et stockée :", newRecipeData);
            
            // Étape 4: Réinitialisation et succès
            messageBox.textContent = '✅ Votre recette a été ajoutée avec succès !';
            messageBox.classList.remove('hidden');
            messageBox.classList.add('success');
            
            form.reset();
            clearAllErrors();
            if(imagePreview) {
                imagePreview.classList.add('hidden');
                imagePreview.src = '';
            }
            
        } else {
            messageBox.textContent = '❌ Veuillez corriger les erreurs dans le formulaire.';
            messageBox.classList.remove('hidden');
            messageBox.classList.add('error-summary');
        }
    });
}


// --- 6. LOGIQUE SPÉCIFIQUE À LA PAGE CONTACT (contact.html) ---

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateContactForm() {
    let isValid = true;
    
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value.trim();
    const messageBody = document.getElementById('contact-message-body').value.trim();
    
    // 1. Validation du Nom (min 2 caractères)
    if (name.length < 2) {
        displayError('contact-name', 'Veuillez entrer votre nom complet.');
        isValid = false;
    } else {
        displayError('contact-name', '');
    }

    // 2. Validation de l'Email (non vide et format valide)
    if (!isValidEmail(email)) {
        displayError('contact-email', 'Veuillez entrer une adresse email valide.');
        isValid = false;
    } else {
        displayError('contact-email', '');
    }

    // 3. Validation du Sujet (min 5 caractères)
    if (subject.length < 5) {
        displayError('contact-subject', 'Le sujet doit être descriptif (min 5 caractères).');
        isValid = false;
    } else {
        displayError('contact-subject', '');
    }

    // 4. Validation du Message (min 20 caractères)
    if (messageBody.length < 20) {
        displayError('contact-message-body', 'Le message est trop court (min 20 caractères).');
        isValid = false;
    } else {
        displayError('contact-message-body', '');
    }

    return isValid;
}

function initializeContactPage() {
    const form = document.getElementById('contact-form');
    const messageBox = document.getElementById('contact-message');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 

        clearAllErrors();
        messageBox.classList.add('hidden');
        messageBox.classList.remove('success', 'error-summary');
        
        const isFormValid = validateContactForm();

        if (isFormValid) {
            console.log("Message de contact valide. Envoi simulé.");
            
            messageBox.textContent = '📧 Votre message a été envoyé avec succès ! Nous vous répondrons bientôt.';
            messageBox.classList.remove('hidden');
            messageBox.classList.add('success');
            
            form.reset();
            clearAllErrors();
            
        } else {
            messageBox.textContent = '❌ Veuillez corriger les erreurs dans le formulaire de contact.';
            messageBox.classList.remove('hidden');
            messageBox.classList.add('error-summary');
        }
    });
}
// ... (Toutes vos sections précédentes: 1. Données, 2. Rendu, 3. Accueil, 4. Recettes, 5. Ajouter, 6. Contact)

// --- 8. LOGIQUE SPÉCIFIQUE À LA PAGE DÉTAIL DE LA RECETTE ---

// Définir la structure pour les commentaires (stockage simulé/persistant)
function loadComments(recipeId) {
    try {
        const commentsString = localStorage.getItem(`comments_recipe_${recipeId}`);
        return commentsString ? JSON.parse(commentsString) : [];
    } catch (e) {
        console.error("Erreur lors du chargement des commentaires:", e);
        return [];
    }
}

function saveComments(recipeId, comments) {
    try {
        localStorage.setItem(`comments_recipe_${recipeId}`, JSON.stringify(comments));
    } catch (e) {
        console.error("Erreur lors de la sauvegarde des commentaires:", e);
    }
}

function renderStars(rating, totalStars = 5) {
    let starsHtml = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < totalStars; i++) {
        if (i < fullStars) {
            starsHtml += '<i class="fa fa-star" style="color: gold;"></i>';
        } else if (i === fullStars && hasHalfStar) {
            // Optionnellement, utiliser une demi-étoile si vous avez le bon icône, ici on utilise un full star coloré si plus de .5
            starsHtml += '<i class="fa fa-star" style="color: gold; opacity: 0.5;"></i>';
        } else {
            starsHtml += '<i class="fa fa-star" style="color: #ccc;"></i>';
        }
    }
    return starsHtml;
}


function renderRatingSummary(comments) {
    const summaryEl = document.getElementById('rating-summary');
    if (!summaryEl) return;
    
    if (comments.length === 0) {
        summaryEl.innerHTML = '<p>Soyez le premier à noter cette recette !</p>';
        return;
    }
    
    const totalRating = comments.reduce((sum, comment) => sum + comment.rating, 0);
    const averageRating = totalRating / comments.length;
    
    const starsHtml = renderStars(averageRating);
    
    summaryEl.innerHTML = `
        <p>Note Moyenne : 
            <span style="font-size: 1.2em; color: var(--color-primary);">${averageRating.toFixed(1)} / 5</span> 
            (${comments.length} avis)</p>
        <div class="comment-rating">${starsHtml}</div>
    `;
}

function renderCommentsList(comments) {
    const listEl = document.getElementById('comments-list');
    if (!listEl) return;
    
    listEl.innerHTML = '<h3>Commentaires (' + comments.length + ')</h3>';
    
    if (comments.length === 0) {
        listEl.innerHTML += '<p>Aucun commentaire pour l\'instant.</p>';
        return;
    }
    
    comments.sort((a, b) => new Date(b.date) - new Date(a.date)); // Triage par date (plus récent en premier)

    comments.forEach(comment => {
        const stars = renderStars(comment.rating);
        const date = new Date(comment.date).toLocaleDateString();
        
        listEl.innerHTML += `
            <div class="comment-item">
                <p class="comment-author">${comment.author}</p>
                <div class="comment-rating">${stars} <span class="comment-date">${date}</span></div>
                <p>${comment.text}</p>
            </div>
        `;
    });
}


function setupStarRating(recipeId) {
    const starContainer = document.getElementById('star-rating');
    const ratingInput = document.getElementById('comment-rating-input');
    if (!starContainer || !ratingInput) return;

    const stars = starContainer.querySelectorAll('.star');

    stars.forEach(star => {
        // Effet de survol (hover)
        star.addEventListener('mouseover', () => {
            starContainer.childNodes.forEach(s => s.classList.remove('selected'));
            let currentStar = star;
            while (currentStar) {
                currentStar.classList.add('selected');
                currentStar = currentStar.nextElementSibling;
            }
        });

        // Effet de sortie (mouseout)
        star.addEventListener('mouseout', () => {
            starContainer.childNodes.forEach(s => s.classList.remove('selected'));
            // Re-sélectionne la valeur actuelle stockée
            const currentValue = parseInt(ratingInput.value, 10);
            if (currentValue > 0) {
                const selectedStar = starContainer.querySelector(`[data-value="${currentValue}"]`);
                let current = selectedStar;
                while (current) {
                    current.classList.add('selected');
                    current = current.nextElementSibling;
                }
            }
        });

        // Clic pour sélectionner la note
        star.addEventListener('click', () => {
            const value = star.dataset.value;
            ratingInput.value = value;

            // Applique la classe 'selected' après le clic
            starContainer.childNodes.forEach(s => s.classList.remove('selected'));
            let currentStar = starContainer.querySelector(`[data-value="${value}"]`);
            while (currentStar) {
                currentStar.classList.add('selected');
                currentStar = currentStar.nextElementSibling;
            }
        });
    });
}

function handleCommentSubmission(recipeId) {
    const form = document.getElementById('comment-form');
    const authorInput = document.getElementById('comment-author');
    const textInput = document.getElementById('comment-text');
    const ratingInput = document.getElementById('comment-rating-input');
    const messageBox = document.getElementById('comment-message');
    
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        messageBox.classList.add('hidden');
        messageBox.classList.remove('success', 'error-summary');
        
        const author = authorInput.value.trim();
        const text = textInput.value.trim();
        const rating = parseInt(ratingInput.value, 10);
        
        let isValid = true;
        
        if (rating === 0) {
            messageBox.textContent = "Veuillez donner une note en cliquant sur les étoiles.";
            messageBox.classList.remove('hidden');
            messageBox.classList.add('error-summary');
            isValid = false;
        }
        if (author.length < 2) {
            displayError('comment-author', 'Nom requis.');
            isValid = false;
        } else {
            displayError('comment-author', '');
        }
        if (text.length < 10) {
            displayError('comment-text', 'Commentaire trop court (min 10 caractères).');
            isValid = false;
        } else {
            displayError('comment-text', '');
        }

        if (isValid) {
            const newComment = {
                author: author,
                text: text,
                rating: rating,
                date: new Date().toISOString()
            };
            
            const comments = loadComments(recipeId);
            comments.push(newComment);
            saveComments(recipeId, comments);
            
            // Mise à jour de l'affichage
            renderCommentsList(comments);
            renderRatingSummary(comments);

            // Succès et réinitialisation
            messageBox.textContent = '✅ Votre commentaire a été publié !';
            messageBox.classList.remove('hidden');
            messageBox.classList.add('success');
            
            form.reset();
            ratingInput.value = 0;
            document.getElementById('star-rating').childNodes.forEach(s => s.classList.remove('selected'));
        } else {
             messageBox.textContent = '❌ Veuillez corriger les erreurs avant de publier.';
             messageBox.classList.remove('hidden');
             messageBox.classList.add('error-summary');
        }
    });
}

function renderRecipeDetail(recipe) {
    const container = document.getElementById('recipe-content-container');
    if (!container) return;

    // Mise à jour du titre de la page
    const pageTitle = document.getElementById('recipe-page-title');
    if (pageTitle) pageTitle.textContent = `${recipe.name} - Site Recettes`;
    
    // Simuler des étapes pour les recettes existantes qui n'ont pas de structure d'étapes
    const prepSteps = [
        "Préchauffez le four ou l'équipement nécessaire et rassemblez tous vos ustensiles de cuisine.",
        "Mélangez d'abord tous les ingrédients secs (farine, épices, sucre) dans un grand bol pour éviter les grumeaux.",
        "Ajoutez ensuite progressivement les ingrédients humides (lait, œufs, huiles) aux ingrédients secs en mélangeant doucement jusqu'à obtenir une pâte homogène.",
        "Laissez reposer la pâte ou la préparation pendant 10 minutes avant de passer à la cuisson, cela améliore souvent la texture.",
        "Suivez le temps de cuisson indiqué et vérifiez la cuisson. Servez chaud et bon appétit !"
    ];

    // Création de la liste des ingrédients
 // ... (le code avant la liste des ingrédients est inchangé) ...

// Création de la liste des ingrédients
const ingredientsList = recipe.ingredients.map(ing => `<li>${ing}</li>`).join('');

// Création des étapes de préparation (VERSION CORRIGÉE)
const stepsHtml = prepSteps.map((step, index) => {
    return `
        <div class="preparation-step">
            <div class="step-number">${index + 1}</div>
            
            <div class="step-details">
                <h3>${index === 0 ? "Préparation initiale" : index === 4 ? "Fin de cuisson et service" : "Action principale"}</h3>
                <p>${step}</p>
            </div>
        </div>
    `;
}).join('');

// ... (le reste du code après la création de stepsHtml est inchangé) ...

    const detailHtml = `
        <header class="recipe-header">
            <h1>${recipe.name}</h1>
            <p class="recipe-description">${recipe.description}</p>
            <div class="recipe-meta">
                <span>⏲️ ${recipe.time} minutes</span>
                <span>⭐ ${recipe.difficulty}</span>
                <span>🏷️ ${recipe.category}</span>
            </div>
        </header>

        <img src="${recipe.image}" alt="Image principale de ${recipe.name}" class="main-recipe-image">
        
        <div class="social-share">
            <button onclick="alert('Partage sur Facebook simulé!');"><i class="fab fa-facebook-f"></i> Partager</button>
            <button onclick="alert('Partage sur Twitter simulé!');"><i class="fab fa-twitter"></i> Tweeter</button>
        </div>

        <section class="ingredients-section">
            <h2>Ingrédients</h2>
            <ul>
                ${ingredientsList}
            </ul>
        </section>

        <section class="preparation-section">
            <h2>Préparation</h2>
            ${stepsHtml}
        </section>
    `;

    container.innerHTML = detailHtml;
}


function initializeRecipeDetailPage() {
    // Vérifie si nous sommes sur la page de détail (grâce à la classe unique)
    if (!document.querySelector('.recipe-detail-page')) {
        return;
    }

    // 1. Récupérer l'ID de la recette depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    // Supposons que l'URL soit: recette-detail.html?id=1
    const recipeId = parseInt(urlParams.get('id'), 10);
    
    if (isNaN(recipeId)) {
        document.getElementById('recipe-content-container').innerHTML = '<h2>❌ Recette non trouvée. ID manquant ou invalide.</h2>';
        return;
    }
    
    // 2. Trouver la recette correspondante dans ALL_RECIPES
    const recipe = ALL_RECIPES.find(r => r.id === recipeId);

    if (recipe) {
        // 3. Rendre le contenu de la recette
        renderRecipeDetail(recipe);
        
        // 4. Charger et afficher les commentaires/notes
        const comments = loadComments(recipeId);
        renderRatingSummary(comments);
        renderCommentsList(comments);

        // 5. Configurer les systèmes interactifs
        setupStarRating(recipeId);
        handleCommentSubmission(recipeId);
        
    } else {
        document.getElementById('recipe-content-container').innerHTML = '<h2>❌ Recette non trouvée.</h2>';
    }
}




// --- 7. INITIALISATION GLOBALE ET ROUTAGE 

document.addEventListener('DOMContentLoaded', () => {
    
    ALL_RECIPES = [...RECIPES, ...loadUserRecipes()]; 

    const path = window.location.pathname;

    
    if (path.includes('recettes.html')) {
        initializeRecipesPage();
    } else if (path.includes('ajouter.html')) {
        initializeAddRecipePage();
    } else if (path.includes('contact.html')) {
        initializeContactPage();
    } else if (path.includes('recette-detail.html')) { 
        initializeRecipeDetailPage(); 
    } else {
        
        initializeHomePage();
    }
});
