// Jenkinsfile for frontend (operation-friday-fe)
pipeline {
    agent any

    environment {
        // Docker 이미지 이름 (Docker Hub 사용자 이름/레포지토리 이름)
        DOCKER_IMAGE = "onlyjoon/operation-friday-fe"
        // 현재 빌드 번호를 태그로 사용
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        // Kubernetes Deployment 이름
        K8S_DEPLOYMENT_NAME = "frontend-app-deployment"
        // Kubernetes Deployment 내 컨테이너 이름
        K8S_CONTAINER_NAME = "frontend-app-container"
    }

    stages {
        stage('Declarative: Checkout SCM') {
            steps {
                // Git 리포지토리 체크아웃 (현재 Jenkinsfile을 가져온 리포지토리)
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Docker 이미지 빌드
                    sh "docker build -t ${DOCKER_IMAGE}:${IMAGE_TAG} ."
                    sh "docker tag ${DOCKER_IMAGE}:${IMAGE_TAG} ${DOCKER_IMAGE}:latest" // latest 태그도 추가
                }
            }
        }

        stage('Push Docker Image to Docker Hub') {
            steps {
                // Docker Hub 로그인 Credential (Jenkins에서 추가한 ID와 동일해야 함)
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    script {
                        sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                        sh "docker push ${DOCKER_IMAGE}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_IMAGE}:latest"
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Kubernetes Deployment 이미지 업데이트
                    // K8S_DEPLOYMENT_NAME이 Kubernetes 클러스터에 존재해야 합니다.
                    sh "kubectl set image deployment/${K8S_DEPLOYMENT_NAME} ${K8S_CONTAINER_NAME}=${DOCKER_IMAGE}:${IMAGE_TAG}"
                }
            }
        }
    }

    post {
        always {
            // 빌드 성공/실패와 관계없이 항상 Docker 로그아웃
            sh "docker logout"
            // 배포 실패 시 메시지 출력
            failure {
                echo "Frontend deployment failed! Check Jenkins logs and Kubernetes Pods."
            }
            success {
                echo "Frontend deployment successful!"
            }
        }
    }
}
