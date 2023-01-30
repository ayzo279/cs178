var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'git@github.com:ayzo279/cs178.git', // Update to point to your repository  
        user: {
            name: 'ayzo279', // update to use your name
            email: 'azhuo@college.harvard.edu' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)