export const questionBank = {
  cse: {
    react: [
      { q: "What is the Virtual DOM in React and how does it work?", answer: "Virtual DOM is a lightweight copy of the actual DOM. React compares virtual DOM with real DOM and updates only changed parts through reconciliation, making updates faster and more efficient." },
      { q: "Explain the difference between state and props in React.", answer: "Props are read-only data passed from parent to child components. State is mutable data managed within a component that can change over time and trigger re-renders." },
      { q: "What are React Hooks and why were they introduced?", answer: "Hooks like useState and useEffect let you use state and lifecycle features in functional components. They simplify code and enable better code reuse through custom hooks." },
      { q: "How does React handle component lifecycle?", answer: "React components go through mounting, updating, and unmounting phases. Hooks like useEffect handle side effects at different lifecycle stages." },
      { q: "What is the purpose of useEffect hook?", answer: "useEffect handles side effects in functional components like data fetching, subscriptions, and manual DOM manipulations. It runs after render and can cleanup on unmount." },
      { q: "Explain React Context API and its use cases.", answer: "Context API allows passing data through component tree without prop drilling. Used for global state like themes, authentication, and language preferences." },
    ],
    javascript: [
      { q: "What is the difference between let, const, and var?", answer: "var is function-scoped and can be redeclared. let is block-scoped and can be reassigned. const is block-scoped and cannot be reassigned but objects can be mutated." },
      { q: "Explain closures in JavaScript.", answer: "A closure is when an inner function has access to outer function's variables even after the outer function has returned. This creates private variables and enables powerful patterns." },
      { q: "What is event delegation in JavaScript?", answer: "Event delegation attaches a single event listener to a parent element to handle events from its children, improving performance and handling dynamic elements." },
      { q: "Explain promises and async/await in JavaScript.", answer: "Promises handle asynchronous operations. Async/await provides cleaner syntax for promises, making async code look synchronous and easier to read." },
      { q: "What is the event loop in JavaScript?", answer: "Event loop handles asynchronous operations by managing call stack, callback queue, and microtask queue to ensure non-blocking execution." },
      { q: "Explain prototype inheritance in JavaScript.", answer: "Objects inherit properties from prototypes. Every object has a prototype chain allowing property and method sharing across instances." },
    ],
    python: [
      { q: "What are list comprehensions in Python?", answer: "List comprehensions provide concise syntax to create lists: [x*2 for x in range(10) if x%2==0]. They're more readable and often faster than loops." },
      { q: "Explain decorators in Python.", answer: "Decorators modify function behavior without changing code. They wrap functions using @decorator syntax for cross-cutting concerns like logging and authentication." },
      { q: "What is the difference between a list and a tuple?", answer: "Lists are mutable and use square brackets. Tuples are immutable and use parentheses. Tuples are faster and can be used as dictionary keys." },
      { q: "How does Python handle memory management?", answer: "Python uses automatic garbage collection and reference counting to manage memory allocation and deallocation efficiently." },
      { q: "Explain generators in Python.", answer: "Generators are functions that yield values lazily using yield keyword. They're memory efficient for large datasets and implement iterators elegantly." },
      { q: "What are lambda functions in Python?", answer: "Lambda functions are anonymous one-line functions defined using lambda keyword. Used for short operations in map, filter, and reduce functions." },
    ],
    datastructures: [
      { q: "Explain the difference between array and linked list.", answer: "Arrays have contiguous memory with O(1) access but costly insertion. Linked lists have O(n) access but efficient O(1) insertion at known positions." },
      { q: "What is a hash table and how does it work?", answer: "Hash tables use hash functions to map keys to array indices for O(1) average case insert, delete, and search operations." },
      { q: "Explain stack and queue data structures.", answer: "Stack follows LIFO (Last In First Out) principle. Queue follows FIFO (First In First Out). Both support O(1) insertion and deletion." },
      { q: "What is a binary search tree?", answer: "BST is a tree where left children are smaller and right children are larger than parent. Provides O(log n) average search, insert, and delete." },
      { q: "Explain time complexity analysis with Big O notation.", answer: "Big O describes worst-case time growth. Common complexities: O(1) constant, O(log n) logarithmic, O(n) linear, O(n²) quadratic." },
    ],
    algorithms: [
      { q: "Explain binary search algorithm.", answer: "Binary search divides sorted array in half repeatedly to find target in O(log n) time. Compares middle element and searches left or right half." },
      { q: "What is dynamic programming?", answer: "Dynamic programming solves problems by breaking into overlapping subproblems, storing results to avoid recomputation. Uses memoization or tabulation." },
      { q: "Explain merge sort algorithm.", answer: "Merge sort divides array into halves recursively, then merges sorted halves. Time complexity O(n log n), space O(n)." },
      { q: "What is the difference between BFS and DFS?", answer: "BFS explores level by level using queue, finds shortest path. DFS explores deep using stack, uses less memory for sparse graphs." },
    ],
    databases: [
      { q: "What is database normalization?", answer: "Normalization organizes data to reduce redundancy through forms (1NF, 2NF, 3NF). Eliminates insertion, update, and deletion anomalies." },
      { q: "Explain ACID properties in databases.", answer: "ACID ensures reliable transactions: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent safety), Durability (permanent)." },
      { q: "What is the difference between SQL and NoSQL?", answer: "SQL databases are relational with fixed schemas and ACID properties. NoSQL offers flexible schemas, horizontal scaling, and eventual consistency." },
      { q: "Explain indexing in databases.", answer: "Indexes create data structures for faster query performance. Trade-off between read speed and write/storage overhead." },
    ],
    oops: [
      { q: "Explain the four pillars of OOP.", answer: "Encapsulation (data hiding), Abstraction (hiding complexity), Inheritance (code reuse), Polymorphism (multiple forms of methods)." },
      { q: "What is the difference between interface and abstract class?", answer: "Interfaces define contracts with no implementation. Abstract classes can have partial implementation and state. Multiple interfaces allowed." },
      { q: "Explain method overloading vs overriding.", answer: "Overloading has same name, different parameters in same class. Overriding redefines parent method in child class with same signature." },
    ],
    general: [
      { q: "Tell me about yourself and your technical background.", answer: "Structure: Brief intro, education highlights, key technical skills in CSE, recent projects, career goals. Keep it 2-3 minutes focused on computer science." },
      { q: "What programming languages are you most comfortable with?", answer: "Discuss your strongest languages, when you learned them, projects built, and why you prefer them for specific tasks." },
      { q: "Describe a challenging coding problem you solved.", answer: "Use STAR method: Situation, Task, Action (algorithm/approach), Result with code complexity analysis." },
      { q: "How do you debug complex technical issues?", answer: "Explain systematic approach: reproduce bug, isolate components, use debugger tools, logging, stack overflow research, version control." },
      { q: "What is your experience with version control systems?", answer: "Discuss Git/GitHub usage, branching strategies, merge conflicts resolution, pull requests, and collaboration workflows." },
    ]
  },
  mechanical: {
    thermodynamics: [
      { q: "Explain the first law of thermodynamics.", answer: "Energy cannot be created or destroyed, only converted. For closed system: ΔU = Q - W where U is internal energy, Q is heat, W is work." },
      { q: "What is the second law of thermodynamics?", answer: "Entropy of isolated system always increases. Heat flows from hot to cold spontaneously. Defines direction of thermodynamic processes." },
      { q: "Explain the Carnot cycle.", answer: "Ideal reversible cycle with maximum efficiency. Four processes: isothermal expansion, adiabatic expansion, isothermal compression, adiabatic compression." },
      { q: "What is enthalpy and how is it different from internal energy?", answer: "Enthalpy H = U + PV includes flow work. Used for constant pressure processes. Internal energy U for closed systems." },
      { q: "Explain heat engines and their efficiency.", answer: "Heat engines convert thermal energy to mechanical work. Efficiency = (W/Qh) = 1 - (Qc/Qh). Limited by Carnot efficiency." },
    ],
    mechanics: [
      { q: "Explain Newton's three laws of motion.", answer: "1) Object at rest stays at rest unless force applied. 2) F=ma. 3) Every action has equal and opposite reaction." },
      { q: "What is the difference between stress and strain?", answer: "Stress is force per unit area (σ = F/A). Strain is deformation ratio (ε = ΔL/L). Young's modulus E = σ/ε." },
      { q: "Explain moment of inertia and its significance.", answer: "Resistance to rotational acceleration. I = Σmr². Depends on mass distribution. Used in rotational dynamics equations." },
      { q: "What is the difference between static and dynamic equilibrium?", answer: "Static equilibrium: body at rest, ΣF=0, ΣM=0. Dynamic equilibrium: constant velocity motion with net force zero." },
    ],
    manufacturing: [
      { q: "Explain different types of machining processes.", answer: "Turning, milling, drilling, grinding. Removes material using cutting tools. CNC automation enables precise complex geometries." },
      { q: "What is casting and its types?", answer: "Pouring molten metal into mold. Types: sand casting, die casting, investment casting. Choice depends on material, complexity, quantity." },
      { q: "Explain welding and its common methods.", answer: "Joining metals by melting. Methods: arc welding, TIG, MIG, spot welding. Each suited for different materials and applications." },
      { q: "What is CNC machining?", answer: "Computer Numerical Control automates machine tools. Programs control cutting paths for precision manufacturing with repeatability." },
    ],
    fluids: [
      { q: "Explain Bernoulli's equation and its applications.", answer: "P + ½ρv² + ρgh = constant. Conservation of energy in fluid flow. Used in airfoil design, venturi meters, pitot tubes." },
      { q: "What is the difference between laminar and turbulent flow?", answer: "Laminar: smooth parallel layers, Re<2300. Turbulent: chaotic mixing, Re>4000. Reynolds number Re = ρVD/μ determines regime." },
      { q: "Explain viscosity and its importance.", answer: "Resistance to flow. Dynamic viscosity μ relates shear stress to velocity gradient. Affects pumping power, heat transfer, and drag." },
    ],
    materials: [
      { q: "Explain different types of materials and their properties.", answer: "Metals (strong, ductile), Polymers (lightweight, flexible), Ceramics (hard, brittle), Composites (combined properties)." },
      { q: "What is heat treatment of metals?", answer: "Controlled heating and cooling to alter properties. Annealing (soften), quenching (harden), tempering (reduce brittleness)." },
      { q: "Explain fatigue failure in materials.", answer: "Failure under cyclic loading below static strength. S-N curves predict life. Critical in rotating components and aircraft structures." },
    ],
    general: [
      { q: "Tell me about yourself and your mechanical engineering background.", answer: "Discuss education, core mechanical subjects studied, projects in design/manufacturing/thermal, internships, career goals in mechanical field." },
      { q: "Describe a challenging mechanical design project you worked on.", answer: "Use STAR: Problem statement, design constraints, CAD modeling, analysis (FEA/CFD), prototyping, testing, final solution." },
      { q: "What CAD software are you proficient in?", answer: "Discuss SolidWorks, AutoCAD, CATIA, or ANSYS experience. Mention specific projects, assemblies, drawings, and simulations done." },
      { q: "How do you approach solving a mechanical design problem?", answer: "Requirements analysis, concept generation, selection criteria, detailed design, analysis verification, prototyping, testing iterations." },
    ]
  },
  electrical: {
    circuits: [
      { q: "Explain Ohm's Law and Kirchhoff's laws.", answer: "Ohm's Law: V=IR. KCL: Current entering node equals leaving. KVL: Voltage sum around loop is zero. Fundamental to circuit analysis." },
      { q: "What is the difference between AC and DC?", answer: "DC flows in one direction with constant voltage. AC alternates direction sinusoidally. AC easier to transform and transmit long distances." },
      { q: "Explain reactance and impedance.", answer: "Reactance is AC resistance from capacitors/inductors. Impedance Z = R + jX combines resistance and reactance. Measured in ohms." },
      { q: "What is a transformer and how does it work?", answer: "Transfers AC power between circuits via electromagnetic induction. Voltage ratio equals turns ratio: V1/V2 = N1/N2." },
      { q: "Explain the concept of power factor.", answer: "Ratio of real power to apparent power. PF = cosφ where φ is phase angle. Poor PF wastes energy and requires larger equipment." },
    ],
    electronics: [
      { q: "Explain PN junction diode operation.", answer: "P-type and N-type semiconductor junction. Forward bias: conducts. Reverse bias: blocks. Used in rectification, switching, regulation." },
      { q: "What is a transistor and its types?", answer: "Semiconductor amplifying/switching device. BJT (current controlled), FET (voltage controlled). Used in amplifiers, oscillators, digital logic." },
      { q: "Explain operational amplifier and its applications.", answer: "High gain differential amplifier. Applications: inverting/non-inverting amplifiers, integrators, differentiators, filters, comparators." },
      { q: "What are logic gates and Boolean algebra?", answer: "Basic digital building blocks: AND, OR, NOT, NAND, NOR, XOR. Boolean algebra simplifies logic expressions for circuit design." },
    ],
    power: [
      { q: "Explain three-phase power systems.", answer: "Three AC voltages 120° apart. More efficient than single phase. Star and delta connections. Used in generation, transmission, motors." },
      { q: "What is a synchronous generator?", answer: "AC generator with rotor speed synchronized to electrical frequency. Used in power plants. Frequency f = (P×N)/120 where P is poles." },
      { q: "Explain protection devices in electrical systems.", answer: "Circuit breakers, fuses, relays protect against overcurrent, short circuit, earth faults. MCB for overload, RCCB for leakage." },
      { q: "What is load balancing in power systems?", answer: "Distributing load evenly across phases to minimize neutral current and improve efficiency. Critical for three-phase distribution." },
    ],
    control: [
      { q: "Explain open-loop and closed-loop control systems.", answer: "Open-loop: no feedback, less accurate. Closed-loop: uses feedback to correct error, self-adjusting, more accurate but complex." },
      { q: "What is PID controller?", answer: "Proportional-Integral-Derivative controller. P: current error, I: accumulated error, D: rate of change. Widely used in process control." },
      { q: "Explain transfer function and stability.", answer: "Transfer function: output/input in Laplace domain. System stable if poles in left half plane. Routh-Hurwitz criterion tests stability." },
    ],
    machines: [
      { q: "Explain working of DC motor.", answer: "Converts electrical to mechanical energy. Current in armature coil creates torque in magnetic field. Commutator reverses current for rotation." },
      { q: "What is an induction motor?", answer: "AC motor with rotating magnetic field inducing rotor current. No physical connection to rotor. Robust, widely used in industry." },
      { q: "Explain the difference between motor and generator.", answer: "Motor converts electrical to mechanical energy. Generator converts mechanical to electrical. Structurally similar, operation reversed." },
    ],
    general: [
      { q: "Tell me about yourself and your electrical engineering background.", answer: "Discuss education, core electrical subjects, projects in circuits/power/electronics, internships, relevant software skills, career goals." },
      { q: "What simulation tools have you used for circuit design?", answer: "Mention MATLAB, PSpice, LTSpice, Proteus experience. Describe specific circuits simulated and analysis performed." },
      { q: "Describe a challenging electrical project you completed.", answer: "STAR format: Problem, design approach, calculations, simulations, implementation, testing, troubleshooting, final results." },
      { q: "How do you troubleshoot an electrical circuit?", answer: "Visual inspection, multimeter measurements, component testing, signal tracing, comparing with schematic, systematic isolation." },
    ]
  },
  civil: {
    structural: [
      { q: "Explain different types of loads on structures.", answer: "Dead load (permanent weight), Live load (occupancy), Wind load, Seismic load, Snow load. Design must consider all load combinations." },
      { q: "What is the difference between bending moment and shear force?", answer: "Shear force is lateral force at section. Bending moment is rotational effect. BM = ∫V dx. Critical for beam design." },
      { q: "Explain reinforced concrete and its advantages.", answer: "Concrete reinforced with steel bars. Concrete strong in compression, steel in tension. Durable, fire resistant, economical." },
      { q: "What are different types of beams?", answer: "Simply supported, continuous, cantilever, fixed. Classification by support conditions affects moment and deflection behavior." },
      { q: "Explain moment of inertia in structural analysis.", answer: "Resistance to bending. I determines beam stiffness. Higher I means less deflection. Depends on cross-section geometry." },
    ],
    geotechnical: [
      { q: "Explain different types of soil.", answer: "Gravel (coarse), Sand (medium), Silt (fine), Clay (very fine). Classification affects bearing capacity, permeability, settlement." },
      { q: "What is bearing capacity of soil?", answer: "Maximum pressure soil can support without shear failure. Depends on soil type, depth, water table. Terzaghi's equation for calculation." },
      { q: "Explain different types of foundations.", answer: "Shallow: spread footing, mat. Deep: pile, caisson. Choice depends on soil conditions and structural loads." },
      { q: "What is soil compaction and why is it important?", answer: "Increasing soil density by removing air voids. Improves strength, reduces settlement, decreases permeability. Critical for embankments and foundations." },
    ],
    transportation: [
      { q: "Explain flexible and rigid pavements.", answer: "Flexible (asphalt): distributes load through layers. Rigid (concrete): beam action distributes load. Maintenance and cost differ." },
      { q: "What is traffic volume study?", answer: "Counts vehicles at locations over time. Data for design, capacity analysis, signal timing, planning. PCU converts mixed traffic." },
      { q: "Explain geometric design of highways.", answer: "Horizontal alignment (curves), vertical alignment (grades), cross-section. Design speed determines curve radius, sight distance." },
    ],
    water: [
      { q: "Explain water treatment processes.", answer: "Screening, sedimentation, coagulation, filtration, disinfection (chlorination). Removes suspended solids, pathogens, dissolved impurities." },
      { q: "What is wastewater treatment?", answer: "Primary (physical separation), Secondary (biological treatment), Tertiary (advanced treatment). BOD reduction is key parameter." },
      { q: "Explain hydraulic gradient and energy line.", answer: "Hydraulic grade line: pressure head. Energy line: total head. Difference equals velocity head. Slopes indicate energy loss." },
    ],
    construction: [
      { q: "Explain different construction methods.", answer: "Cast-in-situ (on-site), Precast (factory made), Steel construction. Each has advantages in speed, quality, cost." },
      { q: "What is project scheduling using CPM/PERT?", answer: "CPM: Critical Path Method finds longest path. PERT: considers uncertainty. Both optimize project duration and resource allocation." },
      { q: "Explain quality control in construction.", answer: "Material testing (concrete cube, aggregate), workmanship inspection, specification compliance, documentation. Ensures structural safety." },
    ],
    general: [
      { q: "Tell me about yourself and your civil engineering background.", answer: "Discuss education, major civil subjects, projects in structural/transportation/water, site experience, AutoCAD/STAAD Pro skills, career goals." },
      { q: "What civil engineering software are you familiar with?", answer: "AutoCAD for drafting, STAAD Pro/ETABS for structural analysis, MATLAB for calculations. Mention specific project applications." },
      { q: "Describe a civil engineering project you worked on.", answer: "STAR: Project type, site conditions, design calculations, drawings, construction challenges, material selection, final outcome." },
      { q: "How do you ensure safety in construction sites?", answer: "PPE compliance, scaffolding inspection, excavation shoring, machinery safety, worker training, regular audits, emergency procedures." },
    ]
  },
  ai: {
    ml: [
      { q: "Explain supervised vs unsupervised learning.", answer: "Supervised learns from labeled data for prediction. Unsupervised finds patterns in unlabeled data. Semi-supervised combines both." },
      { q: "What is overfitting and how to prevent it?", answer: "Model memorizes training data, poor generalization. Prevent: cross-validation, regularization, dropout, early stopping, more data." },
      { q: "Explain gradient descent algorithm.", answer: "Optimization algorithm minimizing loss function. Updates weights: w = w - α∇L. Variants: batch, stochastic, mini-batch gradient descent." },
      { q: "What are activation functions and their types?", answer: "Introduce non-linearity. ReLU (fast, sparse), Sigmoid (0-1), Tanh (-1 to 1), Softmax (multiclass). Choice affects learning." },
      { q: "Explain bias-variance tradeoff.", answer: "Bias: error from wrong assumptions. Variance: error from sensitivity to training data. Balance needed for good generalization." },
    ],
    dl: [
      { q: "Explain Convolutional Neural Networks.", answer: "Designed for image processing. Convolution layers extract features, pooling reduces dimensions, fully connected layers classify. Learns hierarchical features." },
      { q: "What are Recurrent Neural Networks?", answer: "Process sequential data with hidden state memory. LSTM/GRU variants solve vanishing gradient. Used in NLP, time series, speech." },
      { q: "Explain backpropagation in neural networks.", answer: "Computes gradients using chain rule from output to input layers. Updates weights to minimize loss. Foundation of neural network training." },
      { q: "What is transfer learning?", answer: "Using pre-trained model on new task. Fine-tune last layers or use as feature extractor. Requires less data and training time." },
      { q: "Explain batch normalization.", answer: "Normalizes layer inputs to mean 0, variance 1. Speeds training, reduces sensitivity to initialization, acts as regularization." },
    ],
    nlp: [
      { q: "Explain word embeddings like Word2Vec.", answer: "Dense vector representations capturing semantic meaning. Similar words have similar vectors. Word2Vec uses skip-gram or CBOW models." },
      { q: "What are transformers and attention mechanism?", answer: "Self-attention weighs importance of different words. Transformers use multi-head attention, no recurrence. Foundation of BERT, GPT models." },
      { q: "Explain sequence-to-sequence models.", answer: "Encoder processes input sequence, decoder generates output sequence. Used in translation, summarization. Attention improves performance." },
      { q: "What is named entity recognition?", answer: "Identifies and classifies entities (person, organization, location) in text. Uses CRF, BiLSTM-CRF, or transformer models." },
    ],
    cv: [
      { q: "Explain object detection vs image classification.", answer: "Classification: single label per image. Detection: multiple objects with bounding boxes. Detection uses R-CNN, YOLO, SSD architectures." },
      { q: "What is image segmentation?", answer: "Pixel-level classification. Semantic: class per pixel. Instance: individual object separation. Uses U-Net, Mask R-CNN architectures." },
      { q: "Explain data augmentation in computer vision.", answer: "Artificially increases training data: rotation, flipping, scaling, cropping, color jittering. Improves model robustness and prevents overfitting." },
    ],
    algorithms: [
      { q: "Explain different optimization algorithms.", answer: "SGD with momentum, Adam (adaptive learning rate), RMSprop, AdaGrad. Trade-offs between convergence speed and stability." },
      { q: "What is regularization in machine learning?", answer: "Prevents overfitting by constraining model complexity. L1 (sparse), L2 (weight decay), Dropout, Early stopping techniques." },
      { q: "Explain cross-validation techniques.", answer: "K-fold: split data into k parts, train k times. Stratified maintains class distribution. Leave-one-out for small datasets." },
      { q: "What are ensemble methods?", answer: "Combine multiple models for better performance. Bagging (random forest), Boosting (XGBoost, AdaBoost), Stacking reduces variance/bias." },
    ],
    general: [
      { q: "Tell me about yourself and your AI/ML background.", answer: "Discuss education in AI/ML, key courses (neural networks, NLP, CV), frameworks (TensorFlow, PyTorch), projects, research, career goals." },
      { q: "What AI frameworks and tools do you use?", answer: "TensorFlow, PyTorch, Keras, scikit-learn, OpenCV, Pandas, NumPy. Explain specific projects and model implementations." },
      { q: "Describe an AI project you've worked on.", answer: "STAR: Problem statement, data collection/preprocessing, model selection, training approach, evaluation metrics, results, deployment considerations." },
      { q: "How do you handle imbalanced datasets?", answer: "Oversampling minority (SMOTE), undersampling majority, class weights, stratified sampling, ensemble methods, appropriate metrics (F1, AUC)." },
      { q: "What is your approach to debugging ML models?", answer: "Check data quality, start simple baseline, visualize predictions, learning curves, gradient checks, ablation studies, systematic experimentation." },
    ]
  }
};
export default questionBank;