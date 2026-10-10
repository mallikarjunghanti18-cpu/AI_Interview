import React, { useState } from 'react';
import { BackendConfig } from '../../types/interview';
import { apiService } from '../../services/api';

interface SettingsViewProps {
  backendConfig: BackendConfig;
  onUpdateConfig: (config: BackendConfig) => void;
  onBackToDashboard: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  backendConfig,
  onUpdateConfig
}) => {
  const [urlInput, setUrlInput] = useState<string>(backendConfig.baseUrl);
  const [activeTab, setActiveTab] = useState<'backend' | 'android-studio'>('backend');
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [pingResult, setPingResult] = useState<{
    online?: boolean;
    latencyMs?: number;
    error?: string;
  } | null>(null);
  const [copiedCodeTab, setCopiedCodeTab] = useState<string>('');

  const handleSaveUrl = () => {
    const updated = apiService.updateConfig({ baseUrl: urlInput.trim() });
    onUpdateConfig(updated);
    handlePing();
  };

  const handlePing = async () => {
    setIsPinging(true);
    setPingResult(null);
    try {
      const res = await apiService.pingBackend();
      setPingResult(res);
      onUpdateConfig(apiService.getConfig());
    } finally {
      setIsPinging(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeTab(id);
    setTimeout(() => setCopiedCodeTab(''), 2500);
  };

  return (
    <div className="flex flex-col w-full pb-8 gap-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-[22px] font-bold text-[#0b1c30] tracking-tight">
            Settings & Architecture
          </h2>
          <p className="text-[13px] text-[#434655]">
            Configure FastAPI endpoints and inspect Android Studio Jetpack Compose integration.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e5eeff] gap-2">
        <button
          onClick={() => setActiveTab('backend')}
          className={`pb-2.5 px-3 text-[13px] font-semibold transition-all border-b-2 cursor-pointer ${
            activeTab === 'backend'
              ? 'border-[#004ac6] text-[#004ac6]'
              : 'border-transparent text-[#737686] hover:text-[#0b1c30]'
          }`}
        >
          FastAPI Backend
        </button>
        <button
          onClick={() => setActiveTab('android-studio')}
          className={`pb-2.5 px-3 text-[13px] font-semibold transition-all border-b-2 cursor-pointer ${
            activeTab === 'android-studio'
              ? 'border-[#004ac6] text-[#004ac6]'
              : 'border-transparent text-[#737686] hover:text-[#0b1c30]'
          }`}
        >
          Android Studio Code Export
        </button>
      </div>

      {/* Tab 1: Backend Configuration */}
      {activeTab === 'backend' && (
        <div className="flex flex-col gap-4">
          {/* Status Hero Card */}
          <div className="p-4 rounded-xl bg-white border border-[#e5eeff] shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  backendConfig.isOnline ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  {backendConfig.isOnline ? 'cloud_done' : 'cloud_off'}
                </span>
              </div>
              <div>
                <span className="text-[14px] font-bold text-[#0b1c30] block">
                  {backendConfig.isOnline ? 'FastAPI Backend Online' : 'FastAPI Offline / Standby'}
                </span>
                <span className="text-[12px] text-[#737686]">
                  {backendConfig.isOnline
                    ? `Latency: ${backendConfig.latencyMs}ms`
                    : 'Built-in semantic simulation engine active as fallback'}
                </span>
              </div>
            </div>

            <button
              onClick={handlePing}
              disabled={isPinging}
              className="px-3.5 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#e5eeff] text-[#004ac6] font-semibold text-[12px] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[16px] ${isPinging ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isPinging ? 'Testing...' : 'Test Ping'}</span>
            </button>
          </div>

          {/* Configuration Form */}
          <div className="p-4 rounded-xl bg-white border border-[#e5eeff] shadow-xs flex flex-col gap-3">
            <label className="text-[13px] font-semibold text-[#0b1c30]">
              FastAPI Server Base URL
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="http://127.0.0.1:8000"
                className="flex-1 px-3 py-2 bg-[#eff4ff] border border-[#c3c6d7] rounded-xl text-[13px] text-[#0b1c30] font-mono focus:outline-none focus:border-[#004ac6]"
              />
              <button
                onClick={handleSaveUrl}
                className="px-4 py-2 bg-[#004ac6] hover:bg-[#003ea8] text-white rounded-xl font-semibold text-[13px] transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] text-[#737686] self-center">Presets:</span>
              <button
                type="button"
                onClick={() => setUrlInput('http://10.0.2.2:8000')}
                className="px-2.5 py-1 rounded-md bg-[#eff4ff] text-[#004ac6] hover:bg-[#dce9ff] text-[11px] font-mono transition-colors cursor-pointer"
              >
                10.0.2.2:8000 (Android Emulator)
              </button>
              <button
                type="button"
                onClick={() => setUrlInput('http://127.0.0.1:8000')}
                className="px-2.5 py-1 rounded-md bg-[#eff4ff] text-[#004ac6] hover:bg-[#dce9ff] text-[11px] font-mono transition-colors cursor-pointer"
              >
                127.0.0.1:8000 (Local Host)
              </button>
            </div>

            {/* Ping Result Feedback */}
            {pingResult && (
              <div
                className={`mt-2 p-2.5 rounded-lg text-[12px] font-medium flex items-center justify-between ${
                  pingResult.online ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">
                    {pingResult.online ? 'check_circle' : 'error'}
                  </span>
                  <span>
                    {pingResult.online
                      ? `Reachable! Latency: ${pingResult.latencyMs}ms`
                      : `Failed to connect: ${pingResult.error}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Android Emulator Networking Guide */}
          <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dbe1ff] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#004ac6]">
              <span className="material-symbols-outlined text-[18px]">info</span>
              <h4 className="text-[13px] font-semibold">
                Android Emulator Localhost Note (10.0.2.2)
              </h4>
            </div>
            <p className="text-[12px] text-[#434655] leading-relaxed">
              When running on the official Android Emulator, the address <code className="font-mono bg-white px-1 py-0.5 rounded text-[#004ac6]">10.0.2.2</code> aliases the host computer's loopback interface (<code className="font-mono text-[#004ac6]">127.0.0.1</code>). When testing inside a browser, <code className="font-mono bg-white px-1 py-0.5 rounded text-[#004ac6]">http://127.0.0.1:8000</code> is used.
            </p>
            <div className="mt-1 p-2 bg-white rounded-lg font-mono text-[11px] text-[#0b1c30]">
              python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Android Studio Code Export */}
      {activeTab === 'android-studio' && (
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl bg-white border border-[#e5eeff] shadow-xs">
            <h3 className="text-[15px] font-bold text-[#0b1c30] mb-1">
              Android Studio Project Implementation (Kotlin & Jetpack Compose)
            </h3>
            <p className="text-[12px] text-[#434655] leading-relaxed mb-4">
              Here is the exact Android architecture requested in your prompt. You can copy these files directly into your Android Studio project to run natively alongside this web app.
            </p>

            {/* Code Block 1: AndroidManifest.xml */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-semibold text-[#004ac6] font-mono">
                  app/src/main/AndroidManifest.xml
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Permissions required for FastAPI backend communication -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AIInterviewer"
        android:usesCleartextTraffic="true"
        tools:targetApi="31">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.AIInterviewer">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
                      'manifest'
                    )
                  }
                  className="text-[11px] font-semibold text-[#004ac6] hover:underline cursor-pointer"
                >
                  {copiedCodeTab === 'manifest' ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
              <pre className="p-3 bg-[#0f172a] text-[#e2e8f0] rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
{`<!-- Allows cleartext HTTP communication with local FastAPI (10.0.2.2:8000) -->
<uses-permission android:name="android.permission.INTERNET" />
<application
    android:usesCleartextTraffic="true"
    android:theme="@style/Theme.AIInterviewer">
    ...
</application>`}
              </pre>
            </div>

            {/* Code Block 2: Retrofit API Service */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-semibold text-[#004ac6] font-mono">
                  app/src/main/java/com/aiinterviewer/api/InterviewApiService.kt
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `package com.aiinterviewer.api

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface InterviewApiService {
    @POST("analyze-jd")
    suspend fun analyzeJd(@Body request: AnalyzeJdRequest): Response<JobAnalysisResponse>

    @POST("create-interview-plan")
    suspend fun createInterviewPlan(@Body request: CreatePlanRequest): Response<InterviewPlanResponse>

    @POST("start-interview")
    suspend fun startInterview(@Body request: StartInterviewRequest): Response<StartInterviewResponse>

    @POST("next-question")
    suspend fun getNextQuestion(@Body request: NextQuestionRequest): Response<QuestionItem>

    @POST("submit-answer")
    suspend fun submitAnswer(@Body request: SubmitAnswerRequest): Response<AnswerEvaluationResponse>

    @POST("follow-up-question")
    suspend fun submitFollowUpAnswer(@Body request: FollowUpRequest): Response<AnswerEvaluationResponse>

    @GET("interview-result/{session_id}")
    suspend fun getInterviewResult(@Path("session_id") sessionId: String): Response<InterviewResultResponse>
}`,
                      'api-service'
                    )
                  }
                  className="text-[11px] font-semibold text-[#004ac6] hover:underline cursor-pointer"
                >
                  {copiedCodeTab === 'api-service' ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
              <pre className="p-3 bg-[#0f172a] text-[#e2e8f0] rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
{`package com.aiinterviewer.api

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface InterviewApiService {
    @POST("analyze-jd")
    suspend fun analyzeJd(@Body request: AnalyzeJdRequest): Response<JobAnalysisResponse>

    @POST("create-interview-plan")
    suspend fun createInterviewPlan(@Body request: CreatePlanRequest): Response<InterviewPlanResponse>

    @POST("start-interview")
    suspend fun startInterview(@Body request: StartInterviewRequest): Response<StartInterviewResponse>

    @POST("submit-answer")
    suspend fun submitAnswer(@Body request: SubmitAnswerRequest): Response<AnswerEvaluationResponse>

    @GET("interview-result/{session_id}")
    suspend fun getInterviewResult(@Path("session_id") sessionId: String): Response<InterviewResultResponse>
}`}
              </pre>
            </div>

            {/* Code Block 3: Retrofit Client Object */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-semibold text-[#004ac6] font-mono">
                  app/src/main/java/com/aiinterviewer/api/RetrofitClient.kt
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `package com.aiinterviewer.api

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {
    // 10.0.2.2 connects to host computer localhost from Android Emulator
    private const val BASE_URL = "http://10.0.2.2:8000/"

    private val okHttpClient = OkHttpClient.Builder()
        .connectTimeout(15, TimeUnit.SECONDS)
        .readTimeout(15, TimeUnit.SECONDS)
        .addInterceptor(HttpLoggingInterceptor().apply {
            level = HttpLoggingInterceptor.Level.BODY
        })
        .build()

    val apiService: InterviewApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(InterviewApiService::class.java)
    }
}`,
                      'retrofit-client'
                    )
                  }
                  className="text-[11px] font-semibold text-[#004ac6] hover:underline cursor-pointer"
                >
                  {copiedCodeTab === 'retrofit-client' ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
              <pre className="p-3 bg-[#0f172a] text-[#e2e8f0] rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed">
{`object RetrofitClient {
    // 10.0.2.2 is the Android Emulator address for host localhost
    private const val BASE_URL = "http://10.0.2.2:8000/"

    val apiService: InterviewApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(InterviewApiService::class.java)
    }
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
