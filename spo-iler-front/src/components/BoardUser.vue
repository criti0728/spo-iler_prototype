<template>
  <div class="screen">
    <!-- 왼쪽 사이드바 -->
    <div class="left-side">
      <!-- 업로드 섹션 -->
      <div class="upload-section">
        <!-- 사진 업로드 -->
        <div class="upload-box"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        >
          <img id="upload-icon" src="../assets/upload-icon.png" alt="">
          <span v-if="!isDragging" id="dropFilesHere">Drop files here</span>
          <span v-if="!isDragging">OR</span>
          <p v-if="!isDragging" class="click-upload" @click.prevent="uploadByClick">Click here</p>
          <p v-if="isDragging" class="dragging-text">Release to Upload</p>
          <span>ONLY IMAGE files available</span>
          <input type="file" @change="handleImageUpload" accept="image/*" hidden ref="fileInput"/>
        </div>

        <!-- 업로드 이미지 미리보기 -->
        <div class="left-side-image-box">
          <div v-show="showInUploadSection">
            <img class="left-side-image" :src="imageUrl" alt="Uploaded Image" style="max-width: 100%;" />
          </div>
          <p v-show="!showInUploadSection">The image will be displayed here.</p>
        </div>

        <!-- 옵션 선택 영역 -->
        <div class="option-box">
          <!-- 선수/감독 선택 -->
          <label for="role">Role</label>
          <select v-model="role" id="role">
            <option value="player">Player</option>
            <option value="coach">Coach</option>
          </select>

          <!-- 경기 진행 시간 선택 -->
          <label for="gameTime">Game Time(%)</label>
          <input type="number" v-model="gameTime" id="gameTime" min="0" max="100" /> %
          
          <!-- 현재 스코어 선택 -->
          <label for="score">Current Score</label>
          <label for="score">My Team : Opponent</label>
          <input type="number" v-model="score" id="score" /> : <input type="number" v-model="opponentScore" id="opponentScore" />
          
          <!-- Run 버튼 -->
          <button @click.prevent="runAnalyze">Analyze</button>
        </div>
        

        <!-- 사진 업로드 섹션 ->로컬스토리지 관련으로 문제 생길 시 복구하기
        <div>            
          <h4>Upload a photo to detect emotions:</h4>
          <input type="file" @change="handleImageUpload" accept="image/*" />
        </div> -->

        <!-- 업로드된 이미지 미리보기 ->로컬스토리지 관련으로 문제 생길 시 복구하기
        <div v-if="imageUrl">
          <h4>Uploaded Image:</h4>
          <img :src="imageUrl" alt="Uploaded Image" style="max-width: 100%; height: auto;" />
        </div> -->
      </div>
    </div>

    <!-- 메인 섹션 -->
    <div class="main">
      <!-- 결과 섹션 -->
      <div class="result-section">
        <div v-if="showInMainSection && winProbability !== null">
          <h4 :class="['win-probability', winProbability > 50 ? 'green' : 'red']">
            Estimated Winning Probability: {{ winProbability.toFixed(2) }}%
          </h4>
        </div>
        <p v-if="!showInMainSection">
          The predicted win rate will be displayed here.
        </p>
      </div>


      <!-- 분석 섹션 -->
      <div class="analyze-section">
        <!-- 이미지 미리보기 -->
        <div class="main-section-image-box">
          <div v-show="showInMainSection">
            <img :src="imageUrl" alt="Uploaded Image" style="max-width: 100%;" />
          </div>
          <p v-show='!showInMainSection'>The image will be displayed here.</p>
        </div>
        <!-- 감정 분석 결과 표시 -->
        <div class="analysis-box">
          <div v-show='showInMainSection'>
            <h4>{{ emotion }}</h4>
            <!-- 파이차트 -->
            <canvas id="myPieChart" width="400" height="400"></canvas>
          </div>
          <p v-show='!showInMainSection'>The analysis results will be displayed here.</p>
        </div>
      </div>
    </div>

    <div class="right-side">
      <!-- 히스토리 섹션 -->
      <div class="history-section">
        <ActivityLogs :logs="logs" />
      </div>
    </div>
    
    <!-- 숨겨진 캔버스 (face-api.js에서 필요) -->
    <canvas ref="canvas" style="display: none;"></canvas>
  </div>
</template>

<script>
import * as faceapi from "face-api.js"; // face-api.js 가져오기
import UserService from "../services/user.service";
import { compressImage } from "../utils/imageProcessing";
import { saveToLocalStorage, getFromLocalStorage } from "../utils/storage";
import ActivityLogs from "../components/ActivityLogs.vue";
import { Chart } from 'chart.js';

export default {
  name: "User",
  components: {
    ActivityLogs,
  },
  data() {
    return {
      content: "", // 기본 텍스트 콘텐츠
      emotion: null, // 감정 분석 결과
      winProbability: null, // 계산된 승리 확률
      role: "player", // 선수/감독 선택 (기본값: 선수)
      gameTime: 50, // 경기 진행 시간 (0~100%)
      score: 0, // 현재 스코어 (팀 점수)
      opponentScore: 0, // 상대팀 점수
      imageUrl: null, // 이미지 미리보기 URL
      isDragging: false, // 드래그 상태를 추적
      imageFile: null,
      showInUploadSection: false,
      showInMainSection: false,
      pieChart: null,
      logs: [],
    };
  },
  mounted() {
    // 사용자 데이터를 가져오기 위한 서비스 호출
    UserService.getUserBoard().then(
      (response) => {
        this.content = response.data;
      },
      (error) => {
        this.content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );

    // face-api.js 모델 로드
    this.loadModels();
    this.logs = getFromLocalStorage("userLogs");
  },
  methods: {
    // 이미지 드래그 앤 드롭을 위한 함수 3개
    handleDragOver() {
      this.isDragging = true;
      const uploadBox = document.querySelector(".upload-box");
      uploadBox.classList.add("drag-active"); // 드래그 상태 클래스 추가
    },
    handleDragLeave() {
      this.isDragging = false;
      const uploadBox = document.querySelector(".upload-box");
      uploadBox.classList.remove("drag-active"); // 드래그 상태 클래스 제거
    },
    handleDrop(event) {
      this.isDragging = false;
      const uploadBox = document.querySelector(".upload-box");
      uploadBox.classList.remove("drag-active"); // 드래그 상태 클래스 제거
      const file = event.dataTransfer.files[0];
      if (file) {
        this.handleImageUpload(event);
      }
    },
    
    // 클릭으로 파일 업로드
    uploadByClick() {
      this.$refs.fileInput.click();
    },

    // face-api.js 모델 로드 메서드
    async loadModels() {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        await faceapi.nets.faceExpressionNet.loadFromUri("/models");
        
        console.log("Models loaded successfully!");
      } catch (err) {
        console.error("Error loading models:", err);
      }
    },

    // 이미지 업로드 처리
    async handleImageUpload(event) {
      let file = null;
      try {
        file = event.dataTransfer.files[0]; // Drag & Drop 방식
      } catch (error) {
        file = event.target.files[0]; // 클릭 방식
      }

      // 이미지 파일이 아닌 파일을 업로드 했을 때
      if (!file || !file.type.startsWith("image/")) {
        alert("Only image files are allowed!");
      }

      // 파일을 업로드하지 않았을 때
      if (!file) {
        this.emotion = "No file selected.";
        return;
      }
      // 이미지 URL로 미리보기 제공
      this.imageUrl = URL.createObjectURL(file);

      // 미리보기 visibility 변경
      this.showInUploadSection = true;
      this.showInMainSection = false;

      // 이미지 임시 저장
      this.imageFile = file;
    },

    // 업로드된 이미지 분석 메서드
    async runAnalyze() {
      const file = this.imageFile;

      // 이미지 로드
      const image = await this.loadImage(file);
      if (!image) {
        this.emotion = "Failed to load image.";
        return;
      }

      // 캔버스 설정: 캔버스를 이미지 크기에 맞추기
      const canvas = this.$refs.canvas;
      faceapi.matchDimensions(canvas, image);  // 캔버스를 이미지 크기와 맞춤

      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 });


      // 얼굴 감지 및 감정 분석
      const detections = await faceapi.detectAllFaces(image, options).withFaceExpressions();
      console.log("Detections:", detections); // 디버깅: 감지 결과 출력

      if (detections.length > 0) {
        const expressions = detections[0].expressions;
        console.log("Expressions:", expressions); // 디버깅: 감정 데이터 출력

        if (expressions) {
          // 감정을 배열로 변환하고 내림차순으로 정렬
          const sortedEmotions = Object.entries(expressions)
            .sort(([, valueA], [, valueB]) => valueB - valueA) // 확률값 기준 정렬
            .slice(0, 4); // 상위 3개 추출

          // 상위 3개의 감정을 문자열로 변환
          this.emotion = sortedEmotions
            .map(([emotion, value]) => `${emotion}: ${(value * 100).toFixed(2)}%`)
            .join(", ");

          console.log("Top 3 emotions:", this.emotion); // 디버깅: 상위 3개 감정

          // 파이차트 생성 메서드 호출
          const labels = Object.keys(expressions);
          const data = Object.values(expressions).map(value => value * 100);
          this.createPieChart(labels, data);

        } else {
          this.emotion = "No emotions detected.";
        }

      } else {
        this.emotion = "No faces detected.";
      }

      // 승률 계산
      this.calculateWinProbability();
      try {
        // 이미지 압축
        const compressedFile = await compressImage(file);
        this.imageUrl = URL.createObjectURL(compressedFile);

        // 로컬스토리지에 저장
        saveToLocalStorage("userLogs", {
          timestamp: new Date().toISOString(),
          winProbability: this.winProbability.toFixed(2),
          imageUrl: this.imageUrl,
        });
      } catch (error) {
        console.error("Failed to process the image", error);
      }
      // 메인 섹션에 이미지 미리보기 표시
      this.showInMainSection = true;
      // 업로드 섹션에서 미리보기 제거
      this.showInUploadSection = false;

      this.logs = getFromLocalStorage("userLogs");
    },

    // 파이차트 생성 메서드
    createPieChart(labels, data) {
      if (this.pieChart) {
        this.pieChart.destroy(); // 이전 차트 제거
      }

      const ctx = document.getElementById("myPieChart").getContext("2d");
      this.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            label: 'Emotion Analysis',
            data: data,
            backgroundColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderColor: [
              'rgba(255, 255, 255, 1)',
              'rgba(255, 255, 255, 1)',
              'rgba(255, 255, 255, 1)',
              'rgba(255, 255, 255, 1)',
              'rgba(255, 255, 255, 1)',
              'rgba(255, 255, 255, 1)',
              'rgba(255, 255, 255, 1)'
            ],
            borderWidth: 3,
            hoverBackgroundColor: 'rgba(0, 0, 0, 1)',
            hoverBorderWidth: 0,
            hoverBorderColor: 'rgba(255, 255, 255, 1)',
          }]
        },
        // options: {
        //   responsive: true,
        //   plugins: {
        //     legend: {
        //       display: false,
        //       position: 'left',
        //     },
        //     tooltip: {
        //       enabled: true
        //     }
        //   }
        // }
      });
    },

    // 파일에서 이미지를 로드하는 메서드
    loadImage(file) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
      });
    },

    // 승률 계산 메서드
    calculateWinProbability() {
      let probability = 50; // 기본 승률 50%

      // 감정 분석 반영
      const emotionRatios = this.getPositiveEmotionRatio();
      console.log(emotionRatios.negative)
      if (emotionRatios.negative > 0.8) {
        probability -= emotionRatios.negative * 8;
        console.log('probability (negative > 0.8) is :'+ probability);
      } else if (emotionRatios.negative > 0.5) {
        probability -= emotionRatios.negative * 5;
        console.log('probability (negative > 0.5) is :'+ probability);
      } else if (emotionRatios.positive >= 0.5) {
        probability += emotionRatios.positive * 5;
        console.log('probability (positive >= 0.5) is :'+ probability);
      } else if (emotionRatios.positive > 0.8) {
        probability += emotionRatios.positive * 8;
        console.log('probability (positive > 0.8) is :'+ probability);
      } else {
        console.log('No condition met. Current probability is: ' + probability);
      }

      

      // 0:0 점수 상황에서 부정적 감정
      if (this.score === 0 && this.opponentScore === 0 && emotionRatios.negative > 0.5) {
        probability -= 10; // 추가 패널티
      }

      // 경기 진행 시간 반영
      if (this.gameTime <= 25&&emotionRatios.negative<0.5) {
        // 초반 진행: 영향이 작음
        probability += (this.gameTime / 25) * 10; // 최대 10% 상승
      } else if (this.gameTime <= 75) {
        // 중반 진행: 영향이 더 커짐
        probability += 10 + Math.pow((this.gameTime - 25) / 50, 2) * 15; // 최대 추가 15% 상승
      } else {
        // 후반 진행: 승률 급격히 상승
        probability += 25 + ((this.gameTime - 75) / 25) * 20; // 최대 추가 10% 상승
      }
      if (this.gameTime <= 25&&emotionRatios.negative>0.5) {
        // 초반 진행: 영향이 작음
        probability -= (this.gameTime / 25) * 10; // 최대 10% 상승
      } else if (this.gameTime <= 75) {
        // 중반 진행: 영향이 더 커짐
        probability -= 10 + Math.pow((this.gameTime - 25) / 50, 2) * 15; // 최대 추가 15% 상승
      } else {
        // 후반 진행: 승률 급격히 낮아짐
        probability -= 25 + ((this.gameTime - 75) / 25) * 20; // 최대 추가 10% 상승
      }

      // 점수 차이 반영
      const scoreDifference = this.score - this.opponentScore;
      if (scoreDifference > 0) {
        probability += Math.min(60, Math.log(scoreDifference + 1) * 5); // 점수 차이 상승
      } else if (scoreDifference < 0) {
        probability -= Math.min(60, Math.log(Math.abs(scoreDifference) + 1) * 5); // 점수 차이 패널티
      }
      // 경기 진행 시간에 따른 스코어 영향 강화
      let timeScoreImpact = 0;
      if (this.gameTime <= 25) {
        timeScoreImpact = (this.gameTime / 25) * Math.log(Math.abs(scoreDifference) + 1) * 2; // 초반
      } else if (this.gameTime <= 75) {
        timeScoreImpact = 2 + ((this.gameTime - 25) / 50) * Math.log(Math.abs(scoreDifference) + 1) * 5; // 중반
      } else {
        timeScoreImpact = 10 + ((this.gameTime - 75) / 25) * Math.log(Math.abs(scoreDifference) + 1) * 8; // 후반
      }

      // 점수 차이가 클수록 진행 시간의 영향 증가
      if (scoreDifference > 0) {
        probability += timeScoreImpact; // 점수 차이가 유리하면 승률 증가
      } else if (scoreDifference < 0) {
        probability -= timeScoreImpact; // 점수 차이가 불리하면 승률 감소
      }


      // 역할에 따른 승률 조정
      const roleMultiplier = this.role === "coach" ? 0.95 : 1.05;
      probability *= roleMultiplier;

      // 무작위 요소 추가
      const randomFactor = Math.random() * 1 - 0.5; // 랜덤 범위 [-0.5, 0.5]
      probability += randomFactor * 2;

      // 승률은 0~100%로 제한
      this.winProbability = Math.max(0, Math.min(probability, 100));
    },

    // 긍정적인 감정 비율을 계산하는 메서드
    getPositiveEmotionRatio() {
    if (!this.emotion) return 0;

    const emotionEntries = this.emotion.split(", ");
    let positiveEmotion = 0, negativeEmotion = 0;
    emotionEntries.forEach((entry) => {
      const [emotion, percentage] = entry.split(": ");
      const value = parseFloat(percentage) / 100;
      if (["happy", "surprised"].includes(emotion.toLowerCase())) {
        positiveEmotion += value;
      } else if (["angry", "sad"].includes(emotion.toLowerCase())) {
        negativeEmotion += value;
      }
    });

    return {
      positive: positiveEmotion,
      negative: negativeEmotion,
    };
  }

  },
};
</script>

<style scoped>
@import "../styles/BoardUser.css";
</style>