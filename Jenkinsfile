pipeline {
  agent {
    kubernetes {
      label 'jenkins-builder-auth-sdk'
      defaultContainer 'jnlp'
      yaml """
  apiVersion: v1
  kind: Pod
  metadata:
    labels:
        project: auth-sdk
  labels:
    component: ci
  spec:
    # Use service account that can deploy to all namespaces
    serviceAccountName: cd-jenkins
    containers:
      - name: gcloud
        image: gcr.io/cloud-builders/gcloud
        command:
          - cat
        tty: true
      - name: kubectl
        image: gcr.io/cloud-builders/kubectl
        command:
          - cat
        tty: true
    """
    }
  }

  environment {
    PROJECT = "bitclave-base"
    APP_NAME = "base-auth-sdk"
    FE_SVC_NAME = "${APP_NAME}-service"
    CLUSTER = "base-first"
    CLUSTER_ZONE = "us-central1-f"
    IMAGE_TAG = "gcr.io/bitclave-jenkins-ci/${APP_NAME}:${env.BUILD_NUMBER}.${env.GIT_COMMIT}"
    JENKINS_CRED = "bitclave-jenkins-ci"
  }

  stages {
    stage('Build Container') {
      steps {
        sh 'printenv'
        sh 'echo ${IMAGE_TAG}'
        container('gcloud') {
          sh "PYTHONUNBUFFERED=1 gcloud builds submit -t ${IMAGE_TAG} ."
        }
      }
    }

    stage('Deploy Staging') {
      // Production branch
      steps {
        container('kubectl') {
          // Change deployed image in production to the one we just built
          sh("gcloud config get-value account")
          sh("sed -i.bak 's#gcr.io/bitclave-jenkins-ci/base-auth-sdk:id-to-replace#${IMAGE_TAG}#' ./k8s/staging/service-staging.yml")
          step([$class: 'KubernetesEngineBuilder', namespace: 'staging', projectId: env.PROJECT, clusterName: env.CLUSTER, zone: env.CLUSTER_ZONE, manifestPattern: 'k8s/services', credentialsId: env.JENKINS_CRED, verifyDeployments: false])
          step([$class: 'KubernetesEngineBuilder', namespace: 'staging', projectId: env.PROJECT, clusterName: env.CLUSTER, zone: env.CLUSTER_ZONE, manifestPattern: 'k8s/staging', credentialsId: env.JENKINS_CRED, verifyDeployments: false])
          sleep 10 // seconds
          sh("gcloud container clusters get-credentials base-first --zone us-central1-f --project bitclave-base")
          sh("echo `kubectl --namespace=staging get service/${FE_SVC_NAME} -o jsonpath='{.status.loadBalancer.ingress[0].ip}'`")
//          sh("kubectl --namespace=staging set image deployment/base-auth-sdk-staging service=${IMAGE_TAG}")
        }
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'Dockerfile', fingerprint: true
      archiveArtifacts artifacts: 'Jenkinsfile', fingerprint: true
    }
  }
}
