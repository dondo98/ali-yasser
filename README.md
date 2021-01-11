# ACML


#### Description

News-App is a website that helps you search for topics and articles and it also supports variety of features like saving articles in favorites , also it recommends articles to read based on your reading and searching history .

#### To get started

- First clone the repo and open it locally from your favorite editor.

- Run ```npm install```, then change directory to client using ```cd client``` and run ```npm install``` there as well.

- Connect it to your own ```MongoDB``` and ```News API``` from [here](https://newsapi.org/). Then add the ```mongoURI``` and ```newsURI``` and ```secretOrKey``` to a file named ```keys_dev.js``` under ```config``` folder.
- To Run using ```Docker Compose file ``` cmd is ```docker-compose up ```
- To Run using ``` DockerFile``` cmd is ``` docker run acml_app ```
- To know the ``` images ``` that are created in docker cmd is ``` docker images ``` 
- To know the ``` The Containers ``` that are created in docker cmd is ``` docker ps ```
- To stop the ``` dockerFile ``` that is running cmd is ``` docker stop [Container ID] ```

```javascript
module.exports = {
    mongoURI: "<Connection String Goes Here>",
    newsURI: "<API Key Goes Here>",
    secretOrKey: "<Your Secret Key Goes Here>"
};
```

- Finally run ```cd..``` to go back to the main directory and run ```npm run dev```.
