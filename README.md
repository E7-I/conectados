<div align="center">
    <img alt="Conectados hero image" src="./assets/hero.webp" />
</div>

🌐 **Conectados** is a web application where users that offer services (like hairdressing, electricity, gardening, etc.) can connect with those who need them quickly, securely, and reliably.

Each professional can create their profile, upload photos of their work, indicate prices, categories, and available hours. Users can search by type of service, location, or availability, chat directly with the person, schedule services, and leave a review afterward.

## 🛠️ Installation

### Requirements

- **MongoDB** 7+
- **Node.js** 23+

### Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/E7-I/conectados
    ```

2. Go to the server directory:
    ```bash
    cd conectados/server
    ```

3. Install the dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the server directory with the content specified in the `.env.example` file. Make sure to set the `MONGODB_URI` variable with your MongoDB connection string.

5. Now you can run the server:
    ```bash
    npm run dev
    ```

6. Go to the client directory:
    ```bash
    cd ../client
    ```

7. Install the dependencies:
    ```bash
    npm install
    ```

8. ...

## 📑 License

Licensed under [MIT](./LICENSE).