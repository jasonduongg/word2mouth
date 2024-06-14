# Pocket Pokemon

Pocket Pokemon is a mobile app that allows users to engage in virtual Pokemon battles using React Native.

## Getting Started

To get started with Pocket Pokemon, follow these steps:

### Prerequisites

- Node.js
- npm (or yarn)
- CocoaPods (for iOS development)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/jasonduongg/word2mouth
    ```

2. Navigate to the project directory:

    ```bash
    cd {filename}
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

    ```bash
    bundle install
    ```

4. Install CocoaPods (for iOS development):

    ```bash
    cd ios
    pod install
    ```

### Running the App

1. Start the development server:

    ```bash
    npm start
    ```

2. xcrun simctl list devices: pick two different devices on this list (developed for IPhone)

    ```bash
    open ios/AwesomeProject.xcworkspace
    ```

3. Open new terminal
    ```bash
    cd {filename}
    npm run ios --simulator="iPhone {#}”
    ```

4. To run a second simulator, hover the simulator, on top left click on File => New device, pick one that is not running 
    ```bash
    npm run ios --simulator="iPhone {#}”
    ```


### Contributing

As of now the sole contributor to this project's development is Jason Duong

### License

This project is licensed under the [MIT License](LICENSE).
