const mysql = require('mysql2');

// Set up your database connection (use root access for testing)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ' ', // Replace with your actual password
    database: 'recipes_db'
});

// Function to insert a mock user
const insertMockUser = (email, password, username) => {
    const query = `
        INSERT INTO account_db.users (email, password, username)
        VALUES (?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
        db.query(query, [email, password, username], (err, results) => {
            if (err) {
                console.error('Error inserting user:', err);
                reject(err);
            } else {
                console.log('Mock user added with ID:', results.insertId);
                resolve(results.insertId); // Return the inserted user's ID
            }
        });
    });
};

// Function to insert a mock recipe
const insertMockRecipe = (uid, title, date, author, tags, images, body_text) => {
    const query = `
        INSERT INTO recipes (uid, title, date, author, tags, images, body_text)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [uid, title, date, author, tags, images, body_text], (err, results) => {
        if (err) {
            console.error('Error inserting recipe:', err);
        } else {
            console.log('Mock recipe added with ID:', results.insertId);
        }
    });
};

// Function to generate random strings
const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Function to generate dynamic mock recipe data with random content
const generateMockRecipes = (userUids) => {
    return userUids.map((uid) => {
        const title = generateRandomString(10); // Random title
        const author = generateRandomString(8); // Random author
        const tags = generateRandomString(5) + ',' + generateRandomString(5); // Random tags
        const date = new Date().toISOString().split('T')[0]; // Current date
        const body_text = generateRandomString(100); // Random body text
        const image = `${title.toLowerCase()}.jpg`; // Dynamically generated image name

        return {
            uid: uid,
            title: title,
            date: date,
            author: author,
            tags: tags,
            images: image,
            body_text: body_text
        };
    });
};

// Insert mock users first, then insert dynamically generated recipes
const addMockData = async () => {
    try {
        // Generate random mock users
        const mockUsers = Array.from({ length: 3 }).map(() => ({
            email: `${generateRandomString(10)}@example.com`,
            password: 'hashed_password',  // You can replace it with an actual hashed password if needed
            username: generateRandomString(8)
        }));

        // Insert users and get their UIDs
        const userUids = await Promise.all(mockUsers.map(user => insertMockUser(user.email, user.password, user.username)));

        // Generate dynamic mock recipes based on the user UIDs
        const recipes = generateMockRecipes(userUids);

        // Add recipes with the corresponding UIDs
        recipes.forEach((recipe) => {
            insertMockRecipe(recipe.uid, recipe.title, recipe.date, recipe.author, recipe.tags, recipe.images, recipe.body_text);
        });
    } catch (error) {
        console.error('Error adding mock data:', error);
    } finally {
        // Close the database connection
        db.end();
    }
};

// Run the function to add mock data
addMockData();

