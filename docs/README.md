# Top page
**Last update**: _today_

## Featured pages
* [Developer's machine's initial setup](manuals/developer_initial_setup.md)
* [Dynamodb. Essentials and solutions](manuals/dynamodb/tldr.md)
* [Lambda development (JS), common recommendations](./manuals/lambda/common_recommendations.md)
---
## How to edit
This website is build on [Docsify](https://docsify.js.org/) and Github Pages.
### Local
```shell
# Install Doscify
npm i docsify-cli -g
# clone the repository
git clone https://github.com/nikita-brazhnikov/knowledgebase knowledgebase
# 
cd knowledgebase
docsify serve docs
```
2. Go to [http://localhost:3000](http://localhost:3000) to see the website. 
3. Create new markdown pages under `/docs` folder. Edit `/docs/_sidebar.md`.
4. The browser window would update automatically as you change the source code.

?> You also can edit pages directly on GitHub with the web GUI and commit them. Changes would reflect automatically.

!> It may take some time for GitHub pages to reflect the latest changes.
### Update
1. Commit and push it into `master`
4. The changes would reflect automatically [here](https://nikita-brazhnikov.github.io/knowledgebase) 

