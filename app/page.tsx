'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const privacy = formData.get('privacy') === 'on';

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, message, privacy }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || '상담 신청이 성공적으로 접수되었습니다!');
        (event.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || '오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-[Pretendard]">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[600px] flex items-center bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
              alt="Business Analysis"
              fill
              className="opacity-15 object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-8 md:px-12 relative z-10 py-24">
            <div className="max-w-4xl mx-auto text-center space-y-16">
              <div className="text-lg font-semibold text-[#FFA500] bg-[#FFF8E7] py-2 px-4 rounded-full inline-block">
                ⚡️ 오늘 단 3명 한정 무료 진단 제공
              </div>
              <div className="space-y-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2C3E50] leading-relaxed">
                  초보 셀러도 바로 써먹는<br/>
                  상세페이지 <span className="text-[#4A90E2]">&apos;매출 공식&apos;</span>
                </h1>
                <p className="text-lg md:text-xl text-[#495057] leading-relaxed max-w-3xl mx-auto tracking-wide">
                  전환율 상승 전문가의 날카로운 진단으로 매출 상승의 기회를 발견하세요
                </p>
              </div>
              <button 
                onClick={() => {
                  const formSection = document.getElementById('form-section');
                  if (formSection) {
                    formSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="mt-10 bg-[#4A90E2] hover:bg-[#357ABD] text-white text-xl font-bold py-4 px-10 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                무료 상세페이지 진단 받기
              </button>
            </div>
          </div>
        </section>

        {/* Pain Points Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2C3E50] mb-16">
              혹시 초보 셀러 대표님도<br/>이런 고민이 있으신가요?
            </h2>
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="flex items-center gap-6 p-6 rounded-xl bg-[#F8F9FA] transform hover:scale-[1.02] transition-transform duration-200">
                <div className="w-12 h-12 bg-[#E3F2FD] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#4A90E2] text-xl">1</span>
                </div>
                <p className="text-lg md:text-xl text-[#495057]">&quot;광고는 해야 할 것 같은데, 상세페이지가 자신이 없어서 망설여지나요?&quot;</p>
              </div>
              <div className="flex items-center gap-6 p-6 rounded-xl bg-[#F8F9FA] transform hover:scale-[1.02] transition-transform duration-200">
                <div className="w-12 h-12 bg-[#E3F2FD] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#4A90E2] text-xl">2</span>
                </div>
                <p className="text-lg md:text-xl text-[#495057]">&quot;큰맘 먹고 상품을 올렸는데, 왜 아무도 안 살까요?&quot;</p>
              </div>
              <div className="flex items-center gap-6 p-6 rounded-xl bg-[#F8F9FA] transform hover:scale-[1.02] transition-transform duration-200">
                <div className="w-12 h-12 bg-[#E3F2FD] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-[#4A90E2] text-xl">3</span>
                </div>
                <p className="text-lg md:text-xl text-[#495057]">&quot;열심히 만들었는데... 어디가 문제인지, 뭘 바꿔야 매출이 오를지 막막합니다.&quot;</p>
              </div>
            </div>
            <div className="max-w-3xl mx-auto mt-16 p-8 bg-[#E3F2FD] rounded-xl">
              <p className="text-lg text-[#2C3E50] leading-relaxed text-center">
                대표님의 잘못이 아닙니다. 초보 셀러일수록 상세페이지의 <span className="font-bold text-[#4A90E2]">&apos;진짜 문제&apos;</span>를 찾기 어렵습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section className="py-20 bg-[#F8F9FA]">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-16">
                그래서 준비했습니다<br/>
                <span className="text-[#4A90E2] mt-4 block">초보 셀러도 돈 버는 상세페이지의 비밀</span>
              </h2>
              <div className="space-y-12">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <h3 className="text-2xl font-bold text-[#2C3E50] mb-6">
                    더 이상 추측으로 소중한 매출 기회를 놓치지 마세요
                  </h3>
                  <p className="text-[#495057] text-lg leading-relaxed">
                    <span className="font-bold text-[#4A90E2]">전환율 상승 전문가</span>가 직접 분석하여 매출이 안오르는 결정적 원인과 즉시 적용 가능한 개선 전략을 알려드립니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2C3E50] mb-16">
              무료 진단으로 얻을 수 있는<br/>
              <span className="text-[#4A90E2] mt-4 block">초보 셀러 맞춤 혜택</span>
            </h2>
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
              <div className="bg-[#F8F9FA] p-8 rounded-xl">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-[#4A90E2] text-4xl">✓</span>
                  <h3 className="text-xl font-bold text-[#2C3E50]">매출 누수 포인트 정확 진단</h3>
                </div>
                <p className="text-[#495057] ml-12">
                  현재 상세페이지에서 고객이 이탈하는 원인과 첫 구매를 망설이게 만드는 요소를 찾아드립니다.
                </p>
              </div>
              <div className="bg-[#F8F9FA] p-8 rounded-xl">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-[#4A90E2] text-4xl">✓</span>
                  <h3 className="text-xl font-bold text-[#2C3E50]">잠재 고객 설득 로직 점검</h3>
                </div>
                <p className="text-[#495057] ml-12">
                  첫 문장부터 구매 버튼까지, 고객 설득의 흐름이 매끄럽게 연결되어 있는지 분석합니다.
                </p>
              </div>
              <div className="bg-[#F8F9FA] p-8 rounded-xl">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-[#4A90E2] text-4xl">✓</span>
                  <h3 className="text-xl font-bold text-[#2C3E50]">초보자용 3가지 핵심 개선안</h3>
                </div>
                <p className="text-[#495057] ml-12">
                  지금 당장 수정해서 효과를 볼 수 있는 가장 중요한 3가지 액션 플랜을 제시합니다.
                </p>
              </div>
              <div className="bg-[#F8F9FA] p-8 rounded-xl">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-[#4A90E2] text-4xl">✓</span>
                  <h3 className="text-xl font-bold text-[#2C3E50]">숨겨진 가치 제안 발굴</h3>
                </div>
                <p className="text-[#495057] ml-12">
                  대표님의 상품이 가진 독특한 가치와 경쟁력 있는 차별점을 찾아드립니다.
                </p>
              </div>
            </div>
            <div className="max-w-4xl mx-auto mt-16 p-8 bg-[#E3F2FD] rounded-xl text-center">
              <p className="text-lg text-[#2C3E50] leading-relaxed">
                <span className="font-bold">일반적인 분석과는 다릅니다.</span><br/>
                대표님의 실제 &apos;첫 매출 발생&apos;과 &apos;지속적인 수익 증대&apos;에 초점을 맞춘 실전적인 솔루션을 제공합니다.
              </p>
            </div>
          </div>
        </section>

        {/* Urgency Section */}
        <section id="form-section" className="py-20 bg-[#FFF8E7]">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-8">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-[#495057] mb-12">
              분석의 질을 유지하기 위해 <span className="font-bold text-[#FFA500]">하루 3명</span>만 진행합니다
            </p>
            <div className="max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg p-8">
                <p className="text-center text-[#495057] mb-8">
                  간단한 정보를 남겨주시면 순차적으로 연락드려 진단을 진행해드립니다
                </p>
                <div>
                  <label className="block text-[#495057] mb-2 text-left" htmlFor="name">
                    성함 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#4A90E2]"
                    placeholder="홍길동"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[#495057] mb-2 text-left" htmlFor="phone">
                    핸드폰 번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#4A90E2]"
                    placeholder="010-1234-5678"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[#495057] mb-2 text-left" htmlFor="message">
                    현재 가장 큰 고민 (선택사항)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-[#4A90E2] h-32"
                    placeholder="현재 겪고 계신 어려움이나 궁금하신 점을 자유롭게 작성해주세요."
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="privacy"
                    name="privacy"
                    className="rounded text-[#4A90E2]"
                    required
                    disabled={isSubmitting}
                  />
                  <label htmlFor="privacy" className="text-sm text-[#495057]">
                    개인정보 수집 및 이용에 동의합니다 <span className="text-red-500">*</span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white font-bold py-4 px-6 rounded-lg text-lg transform hover:scale-105 transition-all duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '제출 중...' : '무료 상세페이지 진단 받기'}
                </button>
                {submitStatus === 'success' && (
                  <p className="text-green-600 text-center whitespace-pre-line">{submitMessage}</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-600 text-center whitespace-pre-line">{submitMessage}</p>
                )}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <svg className="w-4 h-4 text-[#4A90E2]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-[#495057]">
                    개인정보는 상담 및 분석 목적으로만 활용되며, 안전하게 보호됩니다.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
