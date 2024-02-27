pipeline {
    agent any
    options {
        buildDiscarder(logRotator(daysToKeepStr:'14'))
    }
    environment {
        DOCKER_CREDS=credentials('docker-creds')
        DOCKER_IMAGE_NAME="${DOCKER_REGISTRY}/neims-aqm-fe"
    }
    stages {
        stage('Prepare environment') {
            steps{
                script {
                    def SEMVER_RE = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/
                    switch(GIT_BRANCH) {
                        case "develop":
                            dockerTag="dev"
                            break
                        case ~SEMVER_RE:
                            dockerTag=GIT_BRANCH
                            break
                        default:
                            dockerTag="latest"
                            break
                    }
                }
            }
        }
        stage('Build docker image') {
            steps {
                sh label: "Build application docker image", script:
                """
                docker build -f Dockerfile . -t ${DOCKER_IMAGE_NAME}:${dockerTag}
                """
            }
        }
        stage('Publish docker image'){
            when {
                branch 'develop'
            }
            steps {
                sh label: "Login to docker registry", script: "docker login --username ${DOCKER_CREDS_USR} --password ${DOCKER_CREDS_PSW} ${DOCKER_REGISTRY}"
                sh label: "Publish application docker image", script:
                """
                docker push ${DOCKER_IMAGE_NAME}:${dockerTag}
                """
            }
            post {
                success {
                    build job: "neims-aqm-dev-fe-deploy", wait: false
                }
                always {
                    sh "docker logout ${DOCKER_REGISTRY}"
                }
            }
        }
    }
}