pipeline {
    agent { label 'rdok.dev' }
    triggers { cron('H H(18-19) * * *') }
    options { buildDiscarder( logRotator( numToKeepStr: '5' ) ) }
    environment {
        VIRTUAL_HOST = 'api.graphql-blog.rdok.dev'
        VIRTUAL_PORT = '3007'
        LETSENCRYPT_HOST = 'api.graphql-blog.rdok.dev'
        LETSENCRYPT_EMAIL = credentials('rdok-email')
        DEFAULT_EMAIL = credentials('rdok-email')
    }
    stages {
        stage('Deploy') { 
           steps { dir('api') { ansiColor('xterm') {
              sh '''
                     docker-compose build --pull
                     docker-compose down --remove-orphans
                     docker-compose up -d
               '''
        } } } }
        stage('Health Check') { 
            agent { label "linux" }
            steps { 
                retry(10) { 
                    sleep time: 6, unit: 'SECONDS'
                    sh '''
                    response=$(curl 'https://api.graphql-blog.rdok.dev/' -H 'Accept: text/html')
                    expected='<title>GraphQL Playground</title>'
                    test "${response#*$expected}" != "$response" \
                        || error "Failed asserting the GraphQL API loads correctly"
                    '''
            }
        } }
    }
    post {
        failure {
            slackSend color: '#FF0000',
            message: "@here Failed: <${env.BUILD_URL}console | ${env.JOB_BASE_NAME}#${env.BUILD_NUMBER}>"
        }
        fixed {
            slackSend color: 'good',
            message: "@here Fixed: <${env.BUILD_URL}console | ${env.JOB_BASE_NAME}#${env.BUILD_NUMBER}>"
        }
        success {
            slackSend message: "Stable: <${env.BUILD_URL}console | ${env.JOB_BASE_NAME}#${env.BUILD_NUMBER}>"
        }
    }
}
