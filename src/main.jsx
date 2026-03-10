import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mic, MicOff, Upload, Play, X, History, Trash2, FileText } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min?url';
import { db } from './firebase';
import {
  collection, addDoc, getDocs, deleteDoc, doc,
  query, where, serverTimestamp
} from 'firebase/firestore';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

// faceapi is accessed dynamically via window.faceapi (loaded via CDN script tag)
// Do NOT capture it statically here — it won't be loaded yet at module parse time

const questionBank = {
  cse: {
    react: [
      { q: "What is React and why is it used?", answer: "React is a JavaScript library for building user interfaces, particularly single-page applications. It's used because it allows developers to create reusable UI components, provides efficient rendering through virtual DOM, and has a large ecosystem." },
      { q: "Explain the concept of Virtual DOM in React.", answer: "Virtual DOM is a lightweight copy of the actual DOM. React uses it to improve performance by comparing the virtual DOM with the real DOM and only updating the parts that changed, rather than re-rendering the entire page." },
      { q: "What are React Hooks and why are they important?", answer: "React Hooks are functions that let you use state and other React features in functional components. They're important because they simplify component logic, make code more reusable, and eliminate the need for class components in most cases." }
    ],
    javascript: [
      { q: "What is the difference between let, var, and const in JavaScript?", answer: "var is function-scoped and can be redeclared, let is block-scoped and cannot be redeclared, const is block-scoped and cannot be reassigned. Modern JavaScript prefers let and const for better scoping and preventing bugs." },
      { q: "Explain closures in JavaScript with an example.", answer: "A closure is when a function remembers variables from its outer scope even after the outer function has finished executing. For example, a function returning another function that accesses the outer function's variables creates a closure." },
      { q: "What is event delegation in JavaScript?", answer: "Event delegation is a technique where you attach a single event listener to a parent element instead of multiple listeners to child elements. It uses event bubbling to handle events on dynamically created elements efficiently." }
    ],
    python: [
      { q: "What are the key features of Python?", answer: "Python's key features include easy-to-read syntax, dynamic typing, automatic memory management, extensive standard library, support for multiple programming paradigms, and a large ecosystem of third-party packages." },
      { q: "Explain the difference between lists and tuples in Python.", answer: "Lists are mutable (can be changed after creation) and use square brackets. Tuples are immutable (cannot be changed) and use parentheses. Tuples are faster and can be used as dictionary keys, while lists are more flexible." },
      { q: "What is a decorator in Python?", answer: "A decorator is a function that takes another function and extends its behavior without explicitly modifying it. It's denoted with @decorator_name syntax and is commonly used for logging, authentication, and timing functions." }
    ],
    datastructures: [
      { q: "What is the difference between an array and a linked list?", answer: "Arrays store elements in contiguous memory with O(1) access time but expensive insertions/deletions. Linked lists store elements with pointers, have O(n) access time but efficient insertions/deletions. Arrays are better for random access, linked lists for frequent modifications." },
      { q: "Explain the concept of a Binary Search Tree.", answer: "A Binary Search Tree is a tree data structure where each node has at most two children, and for each node, all values in the left subtree are smaller and all values in the right subtree are larger. It provides efficient searching, insertion, and deletion operations." },
      { q: "What is the time complexity of common sorting algorithms?", answer: "Bubble Sort, Selection Sort, and Insertion Sort have O(n²) time complexity. Merge Sort and Quick Sort have O(n log n) average time complexity. Heap Sort has O(n log n) worst-case time complexity. Quick Sort has O(n²) worst case but is often fastest in practice." }
    ],
    databases: [
      { q: "What is the difference between SQL and NoSQL databases?", answer: "SQL databases are relational, use structured schemas, and are good for complex queries. NoSQL databases are non-relational, schema-flexible, and better for large-scale data and horizontal scaling. SQL ensures ACID properties, while NoSQL prioritizes availability and partition tolerance." },
      { q: "Explain database normalization and its benefits.", answer: "Normalization is organizing database tables to reduce redundancy and dependency. It involves dividing large tables into smaller ones and defining relationships. Benefits include reduced data redundancy, improved data integrity, easier maintenance, and better query performance." },
      { q: "What are database indexes and how do they work?", answer: "Indexes are data structures that improve query speed by creating pointers to data locations. They work like book indexes, allowing the database to find data without scanning entire tables. Trade-off is they speed up reads but slow down writes and take up storage space." }
    ],
    oops: [
      { q: "Explain the four pillars of Object-Oriented Programming.", answer: "The four pillars are: Encapsulation (bundling data and methods), Abstraction (hiding implementation details), Inheritance (reusing code from parent classes), and Polymorphism (objects taking multiple forms). These principles help create modular, reusable, and maintainable code." },
      { q: "What is the difference between abstraction and encapsulation?", answer: "Abstraction hides complexity by showing only essential features, focusing on what an object does. Encapsulation bundles data and methods together and restricts direct access, focusing on how it's implemented. Abstraction is about design, encapsulation is about data hiding." },
      { q: "Explain polymorphism with a real-world example.", answer: "Polymorphism means one interface, multiple implementations. Real-world example: a 'Shape' class with a draw() method. Circle, Square, and Triangle all implement draw() differently, but can be treated as Shape objects. This allows writing flexible code that works with different object types." }
    ],
    mechanical: [
      { q: "What is CAD and how do you use it in your design process?", answer: "CAD (Computer-Aided Design) is software for creating 2D and 3D digital models of parts and assemblies. I use it to create detailed technical drawings, perform design analysis, check tolerances, simulate manufacturing processes, and communicate designs to manufacturing teams. It increases accuracy and reduces prototyping costs." },
      { q: "Explain your experience with manufacturing processes and techniques.", answer: "I have hands-on experience with various manufacturing methods including CNC machining, injection molding, welding, assembly, and quality control. I understand material properties, tolerances, and production constraints. I work closely with manufacturing teams to ensure designs are practical, cost-effective, and meet quality standards." },
      { q: "How do you approach troubleshooting mechanical problems?", answer: "My troubleshooting approach follows these steps: 1) Define the problem clearly, 2) Gather relevant data and observations, 3) Develop hypotheses, 4) Test systematically, 5) Analyze results, 6) Implement solution, 7) Verify and document. I focus on root causes, not just symptoms, and communicate findings clearly." },
      { q: "Describe your experience with project management in engineering.", answer: "I've managed multiple mechanical engineering projects from concept to production. Key responsibilities include: defining project scope and timeline, resource allocation, risk management, cross-functional team coordination, budget tracking, quality assurance, and stakeholder communication. I use project management tools and methodologies to ensure on-time delivery." },
      { q: "How do you lead and mentor engineering teams?", answer: "As a leader, I focus on: setting clear goals and expectations, providing technical guidance and mentoring, fostering a collaborative environment, supporting professional development, recognizing achievements, addressing performance issues constructively, and leading by example with technical excellence and ethical standards." }
    ],
    general: [
      { q: "Tell me about yourself and your technical background.", answer: "A good answer should include your education, relevant experience, key technical skills, notable projects, and what motivates you. Keep it concise, relevant to the position, and highlight your unique strengths." },
      { q: "What is your approach to learning new technologies?", answer: "Describe a systematic approach: reading documentation, building/studying projects, following tutorials, joining communities, and applying new skills to real problems. Emphasize continuous learning and staying updated with industry trends." },
      { q: "Describe a challenging technical problem you solved.", answer: "Use the STAR method: Situation (context), Task (what needed to be done), Action (specific steps you took), Result (outcome and learning). Include technical details, your decision-making process, and what you learned from the experience." },
      { q: "How do you ensure quality in your projects?", answer: "Good practices include following standards, conducting thorough testing, attention to detail, documentation, quality reviews, continuous improvement, and learning from mistakes. Emphasize both technical practices and collaboration with team members." },
      { q: "What motivates you professionally?", answer: "Genuine answer might include: solving complex problems, creating impactful solutions, continuous learning, working with talented teams, technical challenges, or seeing your work make a difference. Connect your motivation to the role and show genuine passion." }
    ]
  }
};

export default function AIInterviewBot({ currentUser }) {
  const [resumeText, setResumeText] = useState('');
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [currentView, setCurrentView] = useState('upload');
  const [showFeedback, setShowFeedback] = useState(true);
  const [askedQuestions, setAskedQuestions] = useState([]);
  const [detectedSkills, setDetectedSkills] = useState([]);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [bodyLanguageFeedback, setBodyLanguageFeedback] = useState({});
  const bodyLanguageFeedbackRef = useRef({});
  const [avatarMood, setAvatarMood] = useState('neutral');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState('Tell me about yourself and your technical background.');
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const currentExpectedAnswerRef = useRef('');
  const askedQuestionsRef = useRef([]);
  const currentQuestionRef = useRef('Tell me about yourself and your technical background.');
  const faceApiReadyRef = useRef(false);

  useEffect(() => {
    // Canvas-based video analysis — no external models needed, works instantly
    // Starts analyzing as soon as camera is ready
    faceApiReadyRef.current = true; // Mark as ready immediately — we use canvas analysis


    // Speech recognition setup
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserResponse(transcript);
      };
      recognitionRef.current.onerror = (event) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
      };
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setAvatarMood('neutral');
      };
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      window.speechSynthesis.cancel();
      stopCamera();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load interview history from Firestore on mount
  useEffect(() => {
    const loadHistory = async () => {
      if (!currentUser?.id) return;
      setHistoryLoading(true);
      try {
        const q = query(
          collection(db, 'interviews'),
          where('userId', '==', currentUser.id)
        );
        const snapshot = await getDocs(q);
        const entries = snapshot.docs
          .map(d => ({ firestoreId: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
        setInterviewHistory(entries);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setHistoryLoading(false);
      }
    };
    loadHistory();
  }, [currentUser?.id]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFileName(file.name);
    setError('');
    setIsProcessing(true);
    try {
      if (file.type === 'text/plain') {
        const text = await file.text();
        setResumeText(text);
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map(item => item.str).join(' ') + '\n';
        }
        if (fullText.trim().length > 10) {
          setResumeText(fullText);
        } else {
          setError('Could not extract text from PDF. Please paste your resume manually.');
          setUploadedFileName('');
        }
      } else {
        setError('Please upload .txt or .pdf files only.');
        setUploadedFileName('');
      }
    } catch (err) {
      setError('Error reading file: ' + err.message + '. Please paste your resume manually.');
      setUploadedFileName('');
    } finally {
      setIsProcessing(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });
      
      console.log('Got media stream:', stream);
      
      if (videoRef.current) {
        console.log('Setting video source object...');
        videoRef.current.srcObject = stream;
        
        // Ensure video element plays
        videoRef.current.play().then(() => {
          console.log('Video playing successfully');
        }).catch(err => {
          console.error('Play error:', err);
        });
      }
      
      setVideoStream(stream);
      setCameraEnabled(true);
      
      // Initialize feedback to show emotion will be detected
      setBodyLanguageFeedback({
        posture: '👀 Initializing face detection...',
        engagement: 'Position face in view',
        confidence: 'Getting ready to analyze',
        emotions: { primary: 'processing', confidence: 0 },
        scores: { posture: 0, eyeContact: 0, confidence: 0, overall: 0 },
        timestamp: Date.now()
      });
      
      // Wait for video to actually play before detection
      setTimeout(() => {
        console.log('Starting body language detection');
        if (videoRef.current && !videoRef.current.paused) {
          startBodyLanguageDetection();
        } else {
          console.log('Video not ready, retrying...');
          setTimeout(() => startBodyLanguageDetection(), 1000);
        }
      }, 500);
    } catch (err) {
      console.error('Camera error:', err);
      setError(`Camera failed: ${err.message}`);
      setCameraEnabled(false);
    }
  };

  const stopCamera = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    setCameraEnabled(false);
  };

  const startBodyLanguageDetection = () => {
    if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
    // Run immediately on start, then every 1 second
    analyzeBodyLanguage();
    detectionIntervalRef.current = setInterval(() => {
      analyzeBodyLanguage();
    }, 1000);
  };

  const analyzeBodyLanguage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    if (videoRef.current.paused || videoRef.current.readyState < 2) return;

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;

      // Draw current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const W = canvas.width;
      const H = canvas.height;

      // ── 1. BRIGHTNESS — overall scene brightness ──────────────────────────
      let totalBrightness = 0;
      for (let i = 0; i < data.length; i += 4) {
        totalBrightness += (data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114);
      }
      const avgBrightness = totalBrightness / (data.length / 4);

      // ── 2. SKIN TONE DETECTION — find face region ─────────────────────────
      // Skin pixels: R>60, G>40, B>20, R>G, R>B, R-G < 50
      let skinPixels = 0;
      let skinCenterX = 0, skinCenterY = 0;
      let topSkin = H, bottomSkin = 0, leftSkin = W, rightSkin = 0;

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const idx = (y * W + x) * 4;
          const r = data[idx], g = data[idx+1], b = data[idx+2];
          const isSkin = r > 60 && g > 40 && b > 20 &&
                         r > g && r > b &&
                         (r - g) < 50 &&
                         Math.max(r,g,b) - Math.min(r,g,b) > 15;
          if (isSkin) {
            skinPixels++;
            skinCenterX += x;
            skinCenterY += y;
            if (y < topSkin) topSkin = y;
            if (y > bottomSkin) bottomSkin = y;
            if (x < leftSkin) leftSkin = x;
            if (x > rightSkin) rightSkin = x;
          }
        }
      }

      const totalPixels = W * H;
      const skinRatio = skinPixels / totalPixels;
      const faceDetected = skinRatio > 0.04; // at least 4% skin pixels = face present

      if (!faceDetected) {
        const noFace = {
          posture: '🤔 No face detected',
          engagement: '📷 Move closer to the camera',
          confidence: '💡 Make sure lighting is good',
          emotions: { primary: 'no_face', confidence: 0 },
          scores: { posture: 0, eyeContact: 0, confidence: 0, overall: 0 },
          timestamp: Date.now()
        };
        bodyLanguageFeedbackRef.current = noFace;
        setBodyLanguageFeedback(noFace);
        return;
      }

      const avgSkinX = skinCenterX / skinPixels;
      const avgSkinY = skinCenterY / skinPixels;

      // ── 3. HEAD POSITION (posture) ────────────────────────────────────────
      const faceCenterXRatio = avgSkinX / W;
      const faceCenterYRatio = avgSkinY / H;
      const faceHeight = (bottomSkin - topSkin) / H;

      let postureText, postureScore;
      if (faceCenterYRatio < 0.25) {
        postureText = '⚠️ Head tilted back — face the camera directly';
        postureScore = 5;
      } else if (faceCenterYRatio > 0.65) {
        postureText = '⚠️ Head tilted down — look straight ahead';
        postureScore = 5;
      } else if (faceCenterXRatio < 0.25 || faceCenterXRatio > 0.75) {
        postureText = '⚠️ Face not centred — move to centre of frame';
        postureScore = 6;
      } else if (faceHeight < 0.15) {
        postureText = '⚠️ Too far from camera — move closer';
        postureScore = 5;
      } else {
        postureText = '✅ Good head position';
        postureScore = 10;
      }

      // ── 4. EYE CONTACT — detect dark eye regions in upper face ───────────
      // Eyes are in the upper 40% of face region; look for dark pixels in that area
      const eyeRegionTop = Math.floor(topSkin + (bottomSkin - topSkin) * 0.2);
      const eyeRegionBottom = Math.floor(topSkin + (bottomSkin - topSkin) * 0.45);
      let darkPixelsInEyeRegion = 0, eyeRegionTotal = 0;

      for (let y = eyeRegionTop; y < eyeRegionBottom && y < H; y++) {
        for (let x = Math.floor(leftSkin); x < rightSkin && x < W; x++) {
          const idx = (y * W + x) * 4;
          const brightness = data[idx] * 0.299 + data[idx+1] * 0.587 + data[idx+2] * 0.114;
          eyeRegionTotal++;
          if (brightness < 80) darkPixelsInEyeRegion++;
        }
      }

      const eyeDarkRatio = eyeRegionTotal > 0 ? darkPixelsInEyeRegion / eyeRegionTotal : 0;
      let eyeContactText, eyeScore;
      if (eyeDarkRatio > 0.08) {
        eyeContactText = '👀 Good eye contact with camera';
        eyeScore = 10;
      } else if (eyeDarkRatio > 0.04) {
        eyeContactText = '👁️ Moderate eye contact — look at the camera';
        eyeScore = 7;
      } else {
        eyeContactText = '⚠️ Poor eye contact — look directly at camera';
        eyeScore = 4;
      }

      // ── 5. MOUTH REGION — detect movement / openness for emotion ─────────
      const mouthTop = Math.floor(topSkin + (bottomSkin - topSkin) * 0.65);
      const mouthBottom = Math.floor(topSkin + (bottomSkin - topSkin) * 0.90);
      const mouthLeft = Math.floor(leftSkin + (rightSkin - leftSkin) * 0.25);
      const mouthRight = Math.floor(leftSkin + (rightSkin - leftSkin) * 0.75);

      let mouthDarkPixels = 0, mouthTotal = 0;
      let mouthRedTotal = 0;

      for (let y = mouthTop; y < mouthBottom && y < H; y++) {
        for (let x = mouthLeft; x < mouthRight && x < W; x++) {
          const idx = (y * W + x) * 4;
          const r = data[idx], g = data[idx+1], b = data[idx+2];
          const brightness = r * 0.299 + g * 0.587 + b * 0.114;
          mouthTotal++;
          if (brightness < 60) mouthDarkPixels++;
          mouthRedTotal += r - (g + b) / 2; // red bias = lip color
        }
      }

      const mouthOpenRatio = mouthTotal > 0 ? mouthDarkPixels / mouthTotal : 0;
      const avgMouthRed = mouthTotal > 0 ? mouthRedTotal / mouthTotal : 0;

      // ── 6. MOTION DETECTION — compare to previous frame ─────────────────
      const prevFrame = analyzeBodyLanguage._prevFrame;
      let motionScore = 0;
      if (prevFrame && prevFrame.length === data.length) {
        let diff = 0;
        for (let i = 0; i < data.length; i += 16) {
          diff += Math.abs(data[i] - prevFrame[i]);
        }
        motionScore = diff / (data.length / 16);
      }
      analyzeBodyLanguage._prevFrame = new Uint8ClampedArray(data);

      // ── 7. EMOTION INFERENCE from pixel analysis ─────────────────────────
      let emotion, emotionConf, confidenceText, confidenceScore;

      if (mouthOpenRatio > 0.12) {
        // Mouth open = talking / surprised / happy
        emotion = motionScore > 8 ? 'happy' : 'surprised';
        emotionConf = Math.min(95, 60 + Math.round(mouthOpenRatio * 200));
        confidenceText = '😊 Expressive & engaged';
        confidenceScore = 9;
      } else if (avgMouthRed > 15 && mouthOpenRatio < 0.05) {
        // Lips pressed = neutral or stressed
        if (motionScore < 3) {
          emotion = 'neutral';
          emotionConf = 70;
          confidenceText = '😐 Neutral — show more enthusiasm';
          confidenceScore = 6;
        } else {
          emotion = 'focused';
          emotionConf = 75;
          confidenceText = '🎯 Focused and attentive';
          confidenceScore = 8;
        }
      } else if (avgBrightness < 50) {
        emotion = 'sad';
        emotionConf = 55;
        confidenceText = '😟 Lighting too dark — improve lighting';
        confidenceScore = 4;
      } else if (motionScore > 15) {
        emotion = 'nervous';
        emotionConf = 65;
        confidenceText = '😬 Fidgeting detected — stay still & calm';
        confidenceScore = 5;
      } else {
        emotion = 'calm';
        emotionConf = 80;
        confidenceText = '😌 Calm and composed';
        confidenceScore = 8;
      }

      // ── 8. LIGHTING QUALITY ───────────────────────────────────────────────
      if (avgBrightness < 40) {
        postureText = '⚠️ Very dark — improve your lighting';
        postureScore = Math.min(postureScore, 4);
      }

      const finalFeedback = {
        posture: postureText,
        engagement: eyeContactText,
        confidence: confidenceText,
        emotions: { primary: emotion, confidence: emotionConf },
        scores: {
          posture: postureScore,
          eyeContact: eyeScore,
          confidence: confidenceScore,
          overall: Math.round((postureScore + eyeScore + confidenceScore) / 3)
        },
        timestamp: Date.now()
      };

      bodyLanguageFeedbackRef.current = finalFeedback;
      setBodyLanguageFeedback(finalFeedback);

    } catch (err) {
      console.error('Canvas analysis error:', err.message);
    }
  };

  const detectSkills = (text) => {
    const skillMap = {
      mechanical: ['cad', 'manufacturing', 'mechanical engineer', 'robotics', 'troubleshooting', 'project management', 'leadership', 'design expert', 'cadexpert', 'welding', 'cnc', 'prototyping', 'tooling', 'autocad'],
      react: ['react', 'reactjs', 'jsx', 'redux', 'next.js'],
      javascript: ['javascript', 'js', 'typescript', 'node.js', 'nodejs'],
      python: ['python', 'django', 'flask', 'pandas'],
      datastructures: ['data structure', 'algorithm', 'array', 'linked list', 'tree', 'graph'],
      databases: ['sql', 'mysql', 'mongodb', 'database', 'postgresql'],
      oops: ['oop', 'object oriented', 'class', 'inheritance', 'polymorphism'],
      general: ['developer', 'engineer', 'programmer', 'software', 'professional', 'expert']
    };
    const detected = [];
    const lowerText = text.toLowerCase();
    for (const [skill, keywords] of Object.entries(skillMap)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        detected.push(skill);
      }
    }
    return detected.length > 0 ? detected : ['general'];
  };

  const getNextQuestion = (userAnswer) => {
    const mentionedSkills = detectSkills(userAnswer);
    mentionedSkills.forEach(skill => {
      if (!detectedSkills.includes(skill)) {
        setDetectedSkills(prev => [...prev, skill]);
      }
    });
    const category = 'cse';
    const relevantSkills = detectedSkills.length > 0 ? detectedSkills : ['general'];
    let availableQuestions = [];
    relevantSkills.forEach(skill => {
      if (questionBank[category] && questionBank[category][skill]) {
        questionBank[category][skill].forEach(q => {
          if (!askedQuestionsRef.current.includes(q.q)) {
            availableQuestions.push({ ...q, category: skill });
          }
        });
      }
    });
    if (availableQuestions.length === 0 && questionBank[category]?.general) {
      questionBank[category].general.forEach(q => {
        if (!askedQuestionsRef.current.includes(q.q)) {
          availableQuestions.push({ ...q, category: 'general' });
        }
      });
    }
    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const selectedQuestion = availableQuestions[randomIndex];
      return selectedQuestion;
    }
    return null;
  };

  const analyzeAnswer = (answer, expectedAnswer) => {
    const answerLower = answer.toLowerCase();
    const wordCount = answer.split(' ').length;
    let feedback = {
      score: 5,
      positive: [],
      negative: [],
      suggestions: [],
      correctAnswer: expectedAnswer
    };
    if (wordCount < 15) {
      feedback.score -= 2;
      feedback.negative.push("Too brief");
      feedback.suggestions.push("Add more details");
    } else if (wordCount > 100) {
      feedback.score -= 1;
      feedback.negative.push("Too lengthy");
    } else {
      feedback.positive.push("Good length");
      feedback.score += 1;
    }
    if (answerLower.includes('example') || answerLower.includes('project')) {
      feedback.positive.push("Provided examples");
      feedback.score += 1;
    } else {
      feedback.suggestions.push("Add specific examples");
    }
    if (expectedAnswer) {
      const keyWords = expectedAnswer.toLowerCase().split(' ').filter(w => w.length > 4);
      const matchCount = keyWords.filter(word => answerLower.includes(word)).length;
      const matchPercent = (matchCount / keyWords.length) * 100;
      if (matchPercent > 50) {
        feedback.positive.push("Key concepts covered");
        feedback.score += 2;
      } else if (matchPercent > 25) {
        feedback.negative.push("Partially correct");
        feedback.score += 1;
      } else {
        feedback.negative.push("Missing key points");
      }
    }
    feedback.score = Math.max(1, Math.min(10, feedback.score));
    return feedback;
  };

  const speak = (text) => {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onstart = () => {
        setIsSpeaking(true);
        setAvatarMood('speaking');
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setAvatarMood('neutral');
        resolve();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setAvatarMood('neutral');
        resolve();
      };
      window.speechSynthesis.speak(utterance);
    });
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setError('');
      setIsListening(true);
      setAvatarMood('listening');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setAvatarMood('neutral');
    }
  };

  const startInterview = async () => {
    if (!resumeText.trim()) {
      setError('Please upload or paste your resume first');
      return;
    }
    const skills = detectSkills(resumeText);
    setDetectedSkills(skills);
    setIsInterviewStarted(true);
    setCurrentView('interview');
    setIsProcessing(true);
    setError('');
    setAskedQuestions([]);
    await startCamera();
    const welcomeMessage = `Hello ${currentUser.name || 'there'}! I've analyzed your resume and detected skills in: ${skills.join(', ')}. I'm excited to interview you today. Let's begin. Tell me about yourself and your technical background.`;
    const firstQuestion = "Tell me about yourself and your technical background.";
    const firstAnswer = "A good answer should include your education, relevant experience, key technical skills, notable projects, and what motivates you. Keep it concise, relevant to the position, and highlight your unique strengths.";
    setAskedQuestions([firstQuestion]);
    askedQuestionsRef.current = [firstQuestion];
    setCurrentQuestion(firstQuestion);
    currentQuestionRef.current = firstQuestion;
    currentExpectedAnswerRef.current = firstAnswer;
    setMessages([{ role: 'assistant', content: welcomeMessage }]);
    await speak(welcomeMessage);
    setIsProcessing(false);
    setTimeout(() => {
      startListening();
    }, 500);
  };

  const handleUserResponse = async (transcript) => {
    if (!transcript.trim()) return;
    const newMessages = [...messages, { role: 'user', content: transcript }];
    setMessages(newMessages);
    setIsProcessing(true);
    setAvatarMood('thinking');
    setError('');
    try {
      const nextQuestionObj = getNextQuestion(transcript);
      if (!nextQuestionObj) {
        const endMessage = "Excellent work! You've completed the interview. Check your history for detailed feedback on all your answers!";
        setMessages([...newMessages, { role: 'assistant', content: endMessage }]);
        await speak(endMessage);
        setIsInterviewStarted(false);
        setCurrentView('history');
        stopCamera();
        setIsProcessing(false);
        return;
      }
      const feedback = analyzeAnswer(transcript, currentExpectedAnswerRef.current);
      const questionForThisAnswer = currentQuestionRef.current;
      setAskedQuestions(prev => [...prev, nextQuestionObj.q]);
      askedQuestionsRef.current = [...askedQuestionsRef.current, nextQuestionObj.q];
      let feedbackText = '';
      if (showFeedback) {
        feedbackText = `\n\n📊 Score: ${feedback.score}/10\n`;
        if (feedback.positive.length > 0) {
          feedbackText += `✅ ${feedback.positive.join(', ')}\n`;
        }
        if (feedback.negative.length > 0) {
          feedbackText += `⚠️ ${feedback.negative.join(', ')}\n`;
        }
        if (bodyLanguageFeedbackRef.current.posture) {
          feedbackText += `\n👁️ Body Language:\n`;
          feedbackText += `• ${bodyLanguageFeedbackRef.current.posture}\n`;
          feedbackText += `• ${bodyLanguageFeedbackRef.current.engagement}\n`;
          feedbackText += `• ${bodyLanguageFeedbackRef.current.confidence}\n`;
        }
        feedbackText += `\n✨ Model Answer:\n${feedback.correctAnswer}`;
      }
      const nextMessage = `${feedbackText}\n\n➡️ Next Question:\n${nextQuestionObj.q}`;
      const updatedMessages = [...newMessages, { role: 'assistant', content: nextMessage }];
      setMessages(updatedMessages);
      // Sanitize bodyLanguage — strip any non-serializable fields
      const bl = bodyLanguageFeedbackRef.current || {};
      const safeBodyLanguage = {
        posture: bl.posture || '',
        engagement: bl.engagement || '',
        confidence: bl.confidence || '',
        emotions: {
          primary: bl.emotions?.primary || 'unknown',
          confidence: bl.emotions?.confidence || 0,
        },
        scores: {
          posture: bl.scores?.posture || 0,
          eyeContact: bl.scores?.eyeContact || 0,
          confidence: bl.scores?.confidence || 0,
          overall: bl.scores?.overall || 0,
        },
      };

      // Sanitize feedback — only keep serializable fields
      const safeFeedback = {
        score: feedback.score || 0,
        positive: feedback.positive || [],
        negative: feedback.negative || [],
        suggestions: feedback.suggestions || [],
        correctAnswer: feedback.correctAnswer || '',
      };

      const historyEntry = {
        question: questionForThisAnswer,
        answer: transcript,
        feedback: safeFeedback,
        bodyLanguage: safeBodyLanguage,
        timestamp: new Date().toLocaleString(),
        createdAtMs: Date.now(),
        skills: detectedSkills || [],
        user: currentUser.email,
        userId: currentUser.id,
      };

      // Save to Firestore NON-BLOCKING — interview continues regardless
      addDoc(collection(db, 'interviews'), {
        ...historyEntry,
        createdAt: serverTimestamp(),
      }).then(docRef => {
        console.log('✅ Saved to Firestore:', docRef.id);
        setInterviewHistory(prev => [{ firestoreId: docRef.id, ...historyEntry }, ...prev]);
      }).catch(err => {
        console.error('❌ Firestore save failed:', err.code, err.message);
        // Still show in local history even if cloud save fails
        setInterviewHistory(prev => [historyEntry, ...prev]);
      });

      setCurrentQuestion(nextQuestionObj.q);
      currentQuestionRef.current = nextQuestionObj.q;
      currentExpectedAnswerRef.current = nextQuestionObj.answer;
      setTimeout(() => analyzeBodyLanguage(), 300);
      await speak(nextQuestionObj.q);
      setTimeout(() => {
        if (isInterviewStarted) {
          startListening();
        }
      }, 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const endInterview = () => {
    stopListening();
    window.speechSynthesis.cancel();
    stopCamera();
    setIsInterviewStarted(false);
    setCurrentView('upload');
    setMessages([]);
    setIsSpeaking(false);
    setIsProcessing(false);
    setAskedQuestions([]);
    askedQuestionsRef.current = [];
    setAvatarMood('neutral');
    setCurrentQuestion('Tell me about yourself and your technical background.');
    currentQuestionRef.current = 'Tell me about yourself and your technical background.';
    currentExpectedAnswerRef.current = '';
  };

  const clearHistory = async () => {
    if (!confirm('Clear all interview history?')) return;
    try {
      // Delete all Firestore docs for this user
      const deletePromises = interviewHistory
        .filter(e => e.firestoreId)
        .map(e => deleteDoc(doc(db, 'interviews', e.firestoreId)));
      await Promise.all(deletePromises);
      setInterviewHistory([]);
    } catch (err) {
      console.error('Failed to clear history:', err);
      setError('Failed to clear history. Please try again.');
    }
  };

  const downloadCSV = () => {
    if (interviewHistory.length === 0) {
      setError('No interview history to download');
      return;
    }

    const headers = ['Date', 'Question', 'Your Answer', 'Score', 'Strengths', 'Areas to Improve', 'Skills Detected'];
    const rows = interviewHistory.map(entry => [
      entry.timestamp,
      `"${entry.question.replace(/"/g, '""')}"`,
      `"${entry.answer.replace(/"/g, '""')}"`,
      entry.feedback.score,
      `"${entry.feedback.positive.join('; ')}"`,
      `"${entry.feedback.negative.join('; ')}"`,
      `"${entry.skills.join('; ')}"`
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_history_${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const Avatar3D = () => {
    return (
      <div className="relative w-full h-80 mx-auto mb-4">
        <div className="relative w-48 h-full mx-auto">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-40 bg-gradient-to-b from-amber-100 to-amber-200 rounded-full shadow-lg">
            <div className="absolute -top-2 left-0 w-full h-24 bg-gradient-to-b from-gray-900 to-gray-800 rounded-t-full"></div>
            <div className="absolute top-8 -left-1 w-6 h-12 bg-gray-800 rounded-l-full"></div>
            <div className="absolute top-8 -right-1 w-6 h-12 bg-gray-800 rounded-r-full"></div>
            <div className="absolute top-12 left-4 right-4 h-8"></div>
            <div className={`absolute top-16 left-6 w-6 h-1.5 bg-gray-800 rounded-full transition-all ${avatarMood === 'thinking' ? 'transform rotate-12' : ''}`}></div>
            <div className={`absolute top-16 right-6 w-6 h-1.5 bg-gray-800 rounded-full transition-all ${avatarMood === 'thinking' ? 'transform -rotate-12' : ''}`}></div>
            <div className="absolute top-20 left-8 flex gap-10">
              <div className="relative">
                <div className="w-5 h-5 bg-white rounded-full shadow-inner"></div>
                <div className={`absolute top-1 left-1 w-3 h-3 bg-gray-900 rounded-full transition-all ${isListening ? 'animate-pulse' : ''}`}></div>
              </div>
              <div className="relative">
                <div className="w-5 h-5 bg-white rounded-full shadow-inner"></div>
                <div className={`absolute top-1 left-1 w-3 h-3 bg-gray-900 rounded-full transition-all ${isListening ? 'animate-pulse' : ''}`}></div>
              </div>
            </div>
            <div className="absolute top-24 left-1/2 transform -translate-x-1/2">
              <div className="w-3 h-6 bg-amber-300 rounded-b-lg shadow"></div>
            </div>
            <div className="absolute top-32 left-1/2 transform -translate-x-1/2">
              {isSpeaking ? (
                <div className="w-10 h-5 bg-red-400 rounded-full animate-pulse"></div>
              ) : (
                <div className={`w-10 h-1.5 ${avatarMood === 'listening' ? 'bg-green-600' : 'bg-gray-700'} rounded-full`}></div>
              )}
            </div>
            <div className="absolute top-20 -left-3 w-5 h-8 bg-amber-200 rounded-full shadow"></div>
            <div className="absolute top-20 -right-3 w-5 h-8 bg-amber-200 rounded-full shadow"></div>
          </div>
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-12 h-10 bg-amber-200 shadow"></div>
          <div className="absolute top-48 left-1/2 transform -translate-x-1/2 w-40 h-32 bg-gradient-to-b from-blue-900 to-blue-800 rounded-b-3xl shadow-xl">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-8 bg-white"></div>
            <div className="absolute top-0 left-8 w-10 h-10 bg-white transform -rotate-45 origin-bottom-right"></div>
            <div className="absolute top-0 right-8 w-10 h-10 bg-white transform rotate-45 origin-bottom-left"></div>
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-20 bg-red-600 shadow"></div>
          </div>
          {isListening && (
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-1">
                <div className="w-2 h-8 bg-green-500 rounded animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-12 bg-green-500 rounded animate-pulse" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-10 bg-green-500 rounded animate-pulse" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            🎤 AI Interview Coach Pro
          </h1>
          <p className="text-gray-600 text-lg">Interactive interviewer with voice, camera & real-time feedback</p>
          <div className="flex gap-3 mt-6 flex-wrap">
            <button 
              onClick={() => setCurrentView('upload')} 
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                currentView === 'upload' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📝 Start New Interview
            </button>
            <button 
              onClick={() => setCurrentView('history')} 
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                currentView === 'history' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <History className="inline w-5 h-5 mr-2" />
              History ({interviewHistory.length})
            </button>
            {interviewHistory.length > 0 && (
              <>
                <button 
                  onClick={downloadCSV} 
                  className="px-6 py-3 rounded-xl font-semibold bg-green-100 text-green-600 hover:bg-green-200 transition-all"
                >
                  📥 Download CSV
                </button>
                <button 
                  onClick={clearHistory} 
                  className="px-6 py-3 rounded-xl font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition-all"
                >
                  <Trash2 className="inline w-5 h-5 mr-2" />
                  Clear
                </button>
              </>
            )}
          </div>
        </div>

        {currentView === 'upload' && !isInterviewStarted && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload Your Resume</h2>
              <label className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all">
                <div className="flex flex-col items-center">
                  <Upload className="w-16 h-16 text-blue-500 mb-3" />
                  <span className="text-lg text-gray-600 font-semibold">Click to upload resume</span>
                  <span className="text-sm text-gray-500 mt-2">PDF or TXT files supported</span>
                  {uploadedFileName && (
                    <div className="mt-3 flex items-center gap-2 text-green-600">
                      <FileText className="w-5 h-5" />
                      <span className="text-sm font-semibold">{uploadedFileName}</span>
                    </div>
                  )}
                </div>
                <input 
                  type="file" 
                  accept=".pdf,.txt,application/pdf,text/plain" 
                  onChange={handleFileUpload}
                  className="hidden" 
                />
              </label>
              <div className="mt-6">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Or paste your resume text:
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here or upload a file above..."
                  className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                />
              </div>
              <div className="mt-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showFeedback}
                    onChange={(e) => setShowFeedback(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <span className="ml-3 text-gray-700">Show real-time feedback & model answers</span>
                </label>
              </div>
              {error && (
                <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
                  {error}
                </div>
              )}
              <button
                onClick={startInterview}
                disabled={!resumeText.trim() || isProcessing}
                className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Play className="w-6 h-6" />
                    Start Interview with AI Interviewer
                  </>
                )}
              </button>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">🎯 Premium Features</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Camera className="w-7 h-7 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-lg">Camera-Based Analysis</p>
                    <p className="text-blue-100 text-sm">Real-time body language & posture feedback</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mic className="w-7 h-7 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-lg">Voice Interaction</p>
                    <p className="text-blue-100 text-sm">Natural speech conversation with the interviewer</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">📊</span>
                  <div>
                    <p className="font-semibold text-lg">Smart Skill Detection</p>
                    <p className="text-blue-100 text-sm">Auto-detects your skills and asks relevant questions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-3xl">✨</span>
                  <div>
                    <p className="font-semibold text-lg">Instant Scoring & Feedback</p>
                    <p className="text-blue-100 text-sm">Get scores, tips & model answers immediately</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <History className="w-7 h-7 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-lg">Complete History</p>
                    <p className="text-blue-100 text-sm">Review all questions, answers & feedback anytime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'interview' && isInterviewStarted && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Your Interviewer</h3>
                <Avatar3D />
                <div className="text-center text-sm text-gray-600 mb-4 min-h-[24px]">
                  {isSpeaking && <p className="text-blue-600 font-semibold">🗣️ Speaking...</p>}
                  {isListening && <p className="text-green-600 font-semibold animate-pulse">🎤 Listening to you...</p>}
                  {isProcessing && <p className="text-purple-600 font-semibold">🤔 Analyzing your answer...</p>}
                  {!isSpeaking && !isListening && !isProcessing && <p className="text-gray-500">Ready</p>}
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Your Video Feed</h4>
                  <div className="relative bg-black rounded-xl overflow-hidden" style={{ width: '100%', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <video 
                      ref={videoRef} 
                      autoPlay
                      playsInline
                      muted
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scaleX(-1)',
                        display: cameraEnabled ? 'block' : 'none',
                        backgroundColor: '#000'
                      }}
                    />
                    {/* Hidden canvas used for pixel-level video frame analysis */}
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    {!cameraEnabled && (
                      <div className="text-center text-white">
                        <Camera className="w-16 h-16 mx-auto mb-3 opacity-40" />
                        <p className="text-sm mb-2">Camera initializing...</p>
                        <p className="text-xs text-gray-400">Allow camera for real-time feedback</p>
                      </div>
                    )}
                  </div>
                </div>
                {bodyLanguageFeedback.posture ? (
                  <>
                    <div className="bg-blue-50 rounded-xl p-4 space-y-3 mb-4">
                      <h4 className="font-semibold text-blue-900 text-sm mb-3">📊 Real-Time Analysis</h4>
                      <div className="space-y-2">
                        <p className="text-xs text-blue-800">• {bodyLanguageFeedback.posture}</p>
                        <p className="text-xs text-blue-800">• {bodyLanguageFeedback.engagement}</p>
                        <p className="text-xs text-blue-800">• {bodyLanguageFeedback.confidence}</p>
                      </div>
                      {bodyLanguageFeedback.emotions?.primary && (
                        <div className={`mt-3 p-3 rounded border-l-4 ${
                          bodyLanguageFeedback.emotions.primary === 'no_face' 
                            ? 'bg-gray-50 border-gray-300' 
                            : 'bg-white border-yellow-400'
                        }`}>
                          <p className="text-xs font-semibold text-blue-900 mb-2">😊 Emotion Analysis:</p>
                          {bodyLanguageFeedback.emotions.primary === 'no_face' ? (
                            <p className="text-sm text-gray-700">Waiting for face detection...</p>
                          ) : bodyLanguageFeedback.emotions.primary === 'processing' ? (
                            <p className="text-sm text-gray-700">Analyzing emotions...</p>
                          ) : (
                            <>
                              <p className="text-sm font-bold text-blue-700 mb-2" style={{textTransform: 'capitalize'}}>
                                {bodyLanguageFeedback.emotions.primary} ({bodyLanguageFeedback.emotions.confidence}% confidence)
                              </p>
                              {bodyLanguageFeedback.emotions.primary === 'fearful' && <p className="text-xs text-red-600">💡 Feeling nervous? Take a deep breath and relax</p>}
                              {bodyLanguageFeedback.emotions.primary === 'nervous' && <p className="text-xs text-orange-600">💡 Try to stay still and calm yourself</p>}
                              {bodyLanguageFeedback.emotions.primary === 'sad' && <p className="text-xs text-blue-600">💪 Stay confident! You got this</p>}
                              {bodyLanguageFeedback.emotions.primary === 'happy' && <p className="text-xs text-green-600">👍 Great energy and enthusiasm!</p>}
                              {bodyLanguageFeedback.emotions.primary === 'surprised' && <p className="text-xs text-orange-600">✨ Channel that energy positively</p>}
                              {bodyLanguageFeedback.emotions.primary === 'neutral' && <p className="text-xs text-gray-600">🎯 Show more enthusiasm and engagement</p>}
                              {bodyLanguageFeedback.emotions.primary === 'calm' && <p className="text-xs text-green-600">😌 Great composure — keep it up!</p>}
                              {bodyLanguageFeedback.emotions.primary === 'focused' && <p className="text-xs text-blue-600">🎯 Good focus — very professional!</p>}
                              {bodyLanguageFeedback.emotions.primary === 'angry' && <p className="text-xs text-red-600">😊 Relax your expression, be friendly</p>}
                              {bodyLanguageFeedback.emotions.primary === 'disgusted' && <p className="text-xs text-red-600">💫 Maintain a positive expression</p>}
                            </>
                          )}
                        </div>
                      )}
                      {bodyLanguageFeedback.scores && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="bg-white rounded p-2 text-center">
                              <div className="font-bold text-blue-600">{bodyLanguageFeedback.scores.posture}/10</div>
                              <div className="text-blue-700 text-xs">Posture</div>
                            </div>
                            <div className="bg-white rounded p-2 text-center">
                              <div className="font-bold text-blue-600">{bodyLanguageFeedback.scores.eyeContact}/10</div>
                              <div className="text-blue-700 text-xs">Eye Contact</div>
                            </div>
                            <div className="bg-white rounded p-2 text-center">
                              <div className="font-bold text-blue-600">{bodyLanguageFeedback.scores.confidence}/10</div>
                              <div className="text-blue-700 text-xs">Confidence</div>
                            </div>
                          </div>
                          <div className="mt-2 bg-white rounded p-2 text-center">
                            <div className="font-bold text-lg text-blue-600">Overall: {bodyLanguageFeedback.scores.overall}/10</div>
                          </div>
                        </div>
                      )}
                      <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">Detected Skills:</span><br/>
                          <span className="text-blue-600">{detectedSkills.join(', ')}</span>
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-blue-50 rounded-xl p-4 mb-4 text-center">
                    <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p className="text-sm text-blue-700 font-semibold">Loading face detection models...</p>
                    <p className="text-xs text-blue-500 mt-1">This may take a few seconds</p>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Live Interview Session</h2>
                  <button
                    onClick={endInterview}
                    className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    End Interview
                  </button>
                </div>
                <div className="h-96 overflow-y-auto mb-6 space-y-4 bg-gray-50 rounded-xl p-4">
                  {messages.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`max-w-3/4 px-6 py-4 rounded-2xl shadow-md ${
                          msg.role === 'assistant' 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                            : 'bg-white text-gray-800 border-2 border-gray-200'
                        }`}
                      >
                        <p className="text-sm font-semibold mb-2">
                          {msg.role === 'assistant' ? '👨‍💼 Interviewer' : '👤 You'}
                        </p>
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="text-center text-gray-500">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700">
                    {error}
                  </div>
                )}
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isProcessing || isSpeaking}
                  className={`w-full px-6 py-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                    isProcessing || isSpeaking
                      ? 'bg-gray-300 cursor-not-allowed'
                      : isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg animate-pulse'
                      : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg text-white'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-8 h-8" />
                      Listening... Click to stop
                    </>
                  ) : (
                    <>
                      <Mic className="w-8 h-8" />
                      {isSpeaking ? 'Interviewer is speaking...' : 'Click to Answer Question'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {currentView === 'history' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">📜 Interview History & Feedback</h2>
            {historyLoading ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 text-lg">Loading your history from cloud...</p>
              </div>
            ) : interviewHistory.length === 0 ? (
              <div className="text-center py-16">
                <History className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <p className="text-xl text-gray-500">No interview history yet</p>
                <p className="text-gray-400 mt-2">Complete an interview to see your progress and feedback!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {interviewHistory.map((entry, idx) => (
                  <div 
                    key={idx} 
                    className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-start mb-4 flex-wrap gap-3">
                      <h3 className="text-lg font-bold text-gray-800 flex-1">
                        Q{interviewHistory.length - idx}: {entry.question}
                      </h3>
                      <span 
                        className={`px-4 py-2 rounded-full text-sm font-bold ${
                          entry.feedback.score >= 7 
                            ? 'bg-green-100 text-green-700' 
                            : entry.feedback.score >= 5 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        Score: {entry.feedback.score}/10
                      </span>
                    </div>
                    <div className="mb-4 p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 font-semibold mb-2">Your Answer:</p>
                      <p className="text-gray-800">{entry.answer}</p>
                    </div>
                    {entry.feedback.positive.length > 0 && (
                      <div className="mb-3 p-3 bg-green-50 rounded-xl">
                        <p className="text-sm font-semibold text-green-800 mb-1">✅ Strengths:</p>
                        <p className="text-sm text-green-700">{entry.feedback.positive.join(', ')}</p>
                      </div>
                    )}
                    {entry.feedback.negative.length > 0 && (
                      <div className="mb-3 p-3 bg-red-50 rounded-xl">
                        <p className="text-sm font-semibold text-red-800 mb-1">⚠️ Areas to Improve:</p>
                        <p className="text-sm text-red-700">{entry.feedback.negative.join(', ')}</p>
                      </div>
                    )}
                    {entry.bodyLanguage?.posture && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-xl">
                        <p className="text-sm font-semibold text-blue-800 mb-2">📊 Behavior Analysis:</p>
                        <p className="text-xs text-blue-700">• {entry.bodyLanguage.posture}</p>
                        <p className="text-xs text-blue-700">• {entry.bodyLanguage.engagement}</p>
                        <p className="text-xs text-blue-700">• {entry.bodyLanguage.confidence}</p>
                        {entry.bodyLanguage.emotions?.primary && entry.bodyLanguage.emotions.primary !== 'unknown' && (
                          <div className="mt-2 p-2 bg-white rounded border-l-4 border-yellow-400">
                            <p className="text-xs font-semibold text-blue-900 mb-1">😊 Detected Emotion:</p>
                            <p className="text-sm font-bold text-blue-700" style={{textTransform: 'capitalize'}}>
                              {entry.bodyLanguage.emotions.primary} ({entry.bodyLanguage.emotions.confidence}% confidence)
                            </p>
                          </div>
                        )}
                        {entry.bodyLanguage.scores && (
                          <div className="mt-2 pt-2 border-t border-blue-200 grid grid-cols-3 gap-1 text-xs text-center">
                            <div><span className="font-bold text-blue-700">{entry.bodyLanguage.scores.posture}</span><div className="text-blue-600">Posture</div></div>
                            <div><span className="font-bold text-blue-700">{entry.bodyLanguage.scores.eyeContact}</span><div className="text-blue-600">Eye Contact</div></div>
                            <div><span className="font-bold text-blue-700">{entry.bodyLanguage.scores.confidence}</span><div className="text-blue-600">Confidence</div></div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <p className="text-sm font-semibold text-purple-900 mb-2">✨ Model Answer:</p>
                      <p className="text-sm text-purple-800 leading-relaxed">{entry.feedback.correctAnswer}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">📅 {entry.timestamp}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}