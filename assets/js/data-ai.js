/*
 * ObservaPedia — AI & Machine Learning Glossary Database
 * AI and ML terminology covering foundations, architectures, techniques, and applications
 * Each entry: { term, abbr?, category, definition, related?[], vendors?[] }
 */
window.OBSERVA_TERMS = (window.OBSERVA_TERMS || []).concat([
  /* ========== AI FOUNDATIONS ========== */
  {
    term: "Artificial Intelligence",
    abbr: "AI",
    category: "AI/ML",
    definition: "The simulation of human intelligence processes by computer systems, including learning from experience, recognizing patterns, understanding language and making decisions. AI encompasses machine learning, deep learning, natural language processing and robotics.",
    related: ["Machine Learning", "Deep Learning", "Neural Network"],
    vendors: ["OpenAI", "Google", "Meta", "Anthropic"]
  },
  {
    term: "Machine Learning",
    abbr: "ML",
    category: "AI/ML",
    definition: "A subset of AI that enables systems to learn and improve from experience without being explicitly programmed. Machine learning algorithms build models from training data and use them to make predictions or decisions on new data.",
    related: ["Artificial Intelligence", "Supervised Learning", "Unsupervised Learning", "Training Data"],
    vendors: ["TensorFlow", "PyTorch", "Scikit-learn"]
  },
  {
    term: "Deep Learning",
    category: "AI/ML",
    definition: "A subset of machine learning using artificial neural networks with multiple layers (deep architectures) to learn hierarchical representations of data. Deep learning powers modern applications in computer vision, natural language processing and speech recognition.",
    related: ["Machine Learning", "Neural Network", "Backpropagation", "Convolutional Neural Network"],
    vendors: ["TensorFlow", "PyTorch", "Keras"]
  },
  {
    term: "Neural Network",
    category: "AI/ML",
    definition: "A computational model inspired by biological neural networks in animal brains, consisting of interconnected nodes (neurons) organized in layers. Neural networks learn by adjusting connection weights through training, enabling them to approximate complex functions.",
    related: ["Deep Learning", "Neuron", "Activation Function", "Backpropagation"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Supervised Learning",
    category: "AI/ML",
    definition: "A machine learning paradigm where models are trained on labeled data (input-output pairs) to learn the mapping between inputs and outputs. Common applications include classification and regression tasks.",
    related: ["Machine Learning", "Unsupervised Learning", "Training Data", "Label"],
    vendors: ["Scikit-learn", "TensorFlow"]
  },
  {
    term: "Unsupervised Learning",
    category: "AI/ML",
    definition: "A machine learning approach where models are trained on unlabeled data to discover hidden patterns, structures or relationships. Common tasks include clustering, dimensionality reduction and anomaly detection.",
    related: ["Machine Learning", "Supervised Learning", "Clustering", "Dimensionality Reduction"],
    vendors: ["Scikit-learn", "TensorFlow"]
  },
  {
    term: "Reinforcement Learning",
    abbr: "RL",
    category: "AI/ML",
    definition: "A machine learning paradigm where an agent learns by interacting with an environment, receiving rewards or penalties for actions. The agent optimizes its behavior to maximize cumulative reward over time.",
    related: ["Machine Learning", "Reward", "Policy", "Q-Learning", "Policy Gradient"],
    vendors: ["OpenAI", "DeepMind"]
  },
  {
    term: "Transfer Learning",
    category: "AI/ML",
    definition: "A machine learning technique where a model trained on one task is adapted for another task, leveraging knowledge learned in the source domain. Transfer learning significantly reduces training time and data requirements for new tasks.",
    related: ["Machine Learning", "Fine-Tuning", "Pre-trained Model", "Domain Adaptation"],
    vendors: ["TensorFlow", "PyTorch", "Hugging Face"]
  },
  {
    term: "Federated Learning",
    category: "AI/ML",
    definition: "A machine learning approach where model training is distributed across multiple decentralized devices or organizations without centralizing raw data. Federated learning preserves privacy while enabling collaborative model improvement.",
    related: ["Machine Learning", "Privacy", "Distributed Training", "Differential Privacy"],
    vendors: ["Google", "Flower", "TensorFlow Federated"]
  },
  {
    term: "Semi-Supervised Learning",
    category: "AI/ML",
    definition: "A machine learning approach that combines small amounts of labeled data with large amounts of unlabeled data during training. Semi-supervised learning is useful when labeling data is expensive or time-consuming.",
    related: ["Supervised Learning", "Unsupervised Learning", "Self-Training", "Pseudo-Labeling"],
    vendors: ["Scikit-learn", "TensorFlow"]
  },

  /* ========== NEURAL NETWORK ARCHITECTURES ========== */
  {
    term: "Convolutional Neural Network",
    abbr: "CNN",
    category: "AI/ML",
    definition: "A neural network architecture designed for processing grid-like data such as images. CNNs use convolutional layers with learned filters to extract spatial features hierarchically, making them highly effective for computer vision tasks.",
    related: ["Deep Learning", "Neural Network", "Convolution", "Pooling", "ResNet"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Recurrent Neural Network",
    abbr: "RNN",
    category: "AI/ML",
    definition: "A neural network architecture with loops that allow it to process sequential data by maintaining hidden state across time steps. RNNs are used for tasks involving sequences, such as time series prediction and language modeling.",
    related: ["Deep Learning", "LSTM", "GRU", "Sequence Modeling", "Sequential Data"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Long Short-Term Memory",
    abbr: "LSTM",
    category: "AI/ML",
    definition: "A specialized RNN architecture designed to learn long-term dependencies in sequential data. LSTMs use memory cells with gates that control information flow, solving the vanishing gradient problem that affects standard RNNs.",
    related: ["Recurrent Neural Network", "GRU", "Vanishing Gradient", "Sequence Modeling"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Gated Recurrent Unit",
    abbr: "GRU",
    category: "AI/ML",
    definition: "A simplified variant of LSTM that uses fewer gates and parameters while maintaining similar performance. GRUs are computationally more efficient than LSTMs and work well for many sequence modeling tasks.",
    related: ["Recurrent Neural Network", "LSTM", "Sequence Modeling"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Transformer",
    category: "AI/ML",
    definition: "A neural network architecture based on self-attention mechanisms that processes entire sequences in parallel rather than sequentially. Transformers have become the foundation for modern large language models and have achieved state-of-the-art results across many AI tasks.",
    related: ["Self-Attention", "Attention Mechanism", "Large Language Model", "BERT", "GPT"],
    vendors: ["TensorFlow", "PyTorch", "Hugging Face"]
  },
  {
    term: "Attention Mechanism",
    category: "AI/ML",
    definition: "A neural network component that allows models to focus on relevant parts of input data by computing weighted combinations of all input elements. Attention mechanisms improve model interpretability and performance on sequence-to-sequence tasks.",
    related: ["Transformer", "Self-Attention", "Query-Key-Value"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Self-Attention",
    category: "AI/ML",
    definition: "An attention mechanism that computes relationships between elements within the same sequence, allowing each element to attend to other elements. Self-attention is the core mechanism enabling the parallelization and effectiveness of Transformer architectures.",
    related: ["Attention Mechanism", "Transformer", "Multi-Head Attention"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Residual Network",
    abbr: "ResNet",
    category: "AI/ML",
    definition: "A deep neural network architecture that introduces skip connections allowing gradients to flow directly through layers. Skip connections enable training of very deep networks by mitigating the vanishing gradient problem.",
    related: ["Deep Learning", "Convolutional Neural Network", "Vanishing Gradient"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Generative Adversarial Network",
    abbr: "GAN",
    category: "AI/ML",
    definition: "A framework where two neural networks (generator and discriminator) compete in a game-theoretic setting. The generator creates synthetic data while the discriminator learns to distinguish real from generated data, driving both networks to improve.",
    related: ["Deep Learning", "Generative Model", "Generator", "Discriminator"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Autoencoder",
    category: "AI/ML",
    definition: "A neural network architecture that learns to compress data into a lower-dimensional latent representation and then reconstruct the original data. Autoencoders are used for dimensionality reduction, anomaly detection and feature learning.",
    related: ["Deep Learning", "Dimensionality Reduction", "Encoder", "Decoder"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Variational Autoencoder",
    abbr: "VAE",
    category: "AI/ML",
    definition: "A generative autoencoder that learns a probabilistic latent space, enabling both dimensionality reduction and generation of new data. VAEs use reparameterization and KL divergence to ensure the latent space is well-structured for sampling.",
    related: ["Autoencoder", "Generative Model", "Latent Space", "Probabilistic Model"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Vision Transformer",
    abbr: "ViT",
    category: "AI/ML",
    definition: "A transformer-based architecture adapted for computer vision that treats image patches as sequences. Vision Transformers have achieved competitive or superior performance compared to convolutional networks on image classification tasks.",
    related: ["Transformer", "Convolutional Neural Network", "Image Classification"],
    vendors: ["Google", "Meta", "TensorFlow"]
  },

  /* ========== NATURAL LANGUAGE PROCESSING ========== */
  {
    term: "Natural Language Processing",
    abbr: "NLP",
    category: "AI/ML",
    definition: "A subfield of AI focused on enabling computers to understand, interpret and generate human language. NLP applications include machine translation, sentiment analysis, question answering and chatbots.",
    related: ["Large Language Model", "Text Classification", "Named Entity Recognition", "Tokenization"],
    vendors: ["OpenAI", "Google", "Hugging Face", "Anthropic"]
  },
  {
    term: "Large Language Model",
    abbr: "LLM",
    category: "AI/ML",
    definition: "A transformer-based neural network trained on massive amounts of text data to predict and generate language. Large language models exhibit emergent capabilities including reasoning, few-shot learning and instruction following.",
    related: ["Transformer", "Natural Language Processing", "Foundation Model", "Prompt Engineering"],
    vendors: ["OpenAI", "Google", "Meta", "Anthropic"]
  },
  {
    term: "BERT",
    abbr: "BERT",
    category: "AI/ML",
    definition: "Bidirectional Encoder Representations from Transformers — a pre-trained language model that uses masked language modeling and next sentence prediction. BERT has become a foundation model for many downstream NLP tasks.",
    related: ["Language Model", "Transformer", "Pre-trained Model", "Transfer Learning"],
    vendors: ["Google", "Hugging Face"]
  },
  {
    term: "GPT",
    abbr: "GPT",
    category: "AI/ML",
    definition: "Generative Pre-trained Transformer — a family of large language models trained on autoregressive language modeling. GPT models exhibit strong performance on language generation and understanding tasks with minimal fine-tuning.",
    related: ["Large Language Model", "Transformer", "Autoregressive Model"],
    vendors: ["OpenAI"]
  },
  {
    term: "Tokenization",
    category: "AI/ML",
    definition: "The process of breaking text into smaller units (tokens) such as words, subwords or characters. Tokenization is a crucial preprocessing step for NLP models, affecting model performance and vocabulary size.",
    related: ["Text Preprocessing", "Vocabulary", "Subword Tokenization", "BPE"],
    vendors: ["Hugging Face", "OpenAI"]
  },
  {
    term: "Embedding",
    category: "AI/ML",
    definition: "A dense vector representation of a word, phrase or document in a continuous vector space. Embeddings capture semantic meaning, allowing similar items to be represented by nearby vectors in high-dimensional space.",
    related: ["Word2Vec", "Tokenization", "Semantic Similarity", "Vector Space"],
    vendors: ["Hugging Face", "OpenAI", "Google"]
  },
  {
    term: "Word2Vec",
    category: "AI/ML",
    definition: "A technique for learning word embeddings by predicting context words (skip-gram model) or predicting a target word from context (CBOW model). Word2Vec was revolutionary in demonstrating that embeddings capture semantic relationships.",
    related: ["Embedding", "Word Representation", "Skip-Gram", "Distributed Representation"],
    vendors: ["Google"]
  },
  {
    term: "GloVe",
    category: "AI/ML",
    definition: "Global Vectors for Word Representation — a method for learning word embeddings by combining matrix factorization and local context window methods. GloVe embeddings capture both global statistics and local context.",
    related: ["Embedding", "Word Representation", "Word2Vec"],
    vendors: ["Stanford"]
  },
  {
    term: "Named Entity Recognition",
    abbr: "NER",
    category: "AI/ML",
    definition: "An NLP task that identifies and classifies entities (persons, organizations, locations) in text. NER is foundational for information extraction, question answering and knowledge graph construction.",
    related: ["Natural Language Processing", "Text Classification", "Sequence Labeling"],
    vendors: ["Hugging Face", "SpaCy"]
  },
  {
    term: "Sentiment Analysis",
    category: "AI/ML",
    definition: "An NLP task that determines the emotional tone or opinion expressed in text (positive, negative, neutral). Sentiment analysis is used in social media monitoring, customer feedback analysis and market research.",
    related: ["Text Classification", "Opinion Mining", "Natural Language Processing"],
    vendors: ["Hugging Face", "TextBlob"]
  },
  {
    term: "Machine Translation",
    category: "AI/ML",
    definition: "The automatic translation of text from one language to another using computational methods. Neural machine translation using sequence-to-sequence models and transformers has dramatically improved translation quality.",
    related: ["Natural Language Processing", "Sequence-to-Sequence", "Transformer"],
    vendors: ["Google Translate", "Meta", "OpenAI"]
  },
  {
    term: "Question Answering",
    abbr: "QA",
    category: "AI/ML",
    definition: "An NLP task where systems are trained to answer questions based on provided context or knowledge. Question answering is central to chatbots, search systems and virtual assistants.",
    related: ["Natural Language Processing", "Text Comprehension", "Reading Comprehension"],
    vendors: ["Hugging Face", "OpenAI"]
  },
  {
    term: "Text Classification",
    category: "AI/ML",
    definition: "An NLP task that assigns predefined categories to text documents. Applications include spam detection, content moderation, topic classification and intent detection.",
    related: ["Natural Language Processing", "Supervised Learning", "Sentiment Analysis"],
    vendors: ["Hugging Face", "Scikit-learn"]
  },
  {
    term: "Text Summarization",
    category: "AI/ML",
    definition: "An NLP task that generates concise summaries of longer text. Abstractive summarization generates new text while extractive summarization selects existing sentences from the source.",
    related: ["Natural Language Processing", "Sequence-to-Sequence", "Abstractive Summarization"],
    vendors: ["Hugging Face", "OpenAI"]
  },
  {
    term: "Prompt Engineering",
    category: "AI/ML",
    definition: "The art of crafting input prompts to elicit desired outputs from language models. Effective prompt engineering involves phrasing, context provision and few-shot examples to guide model behavior.",
    related: ["Large Language Model", "Few-Shot Learning", "In-Context Learning"],
    vendors: ["OpenAI", "Anthropic"]
  },
  {
    term: "Few-Shot Learning",
    category: "AI/ML",
    definition: "A machine learning approach where models learn from a small number of examples and generalize to new tasks. Few-shot learning leverages knowledge from pre-training to rapidly adapt to new problems.",
    related: ["Transfer Learning", "Meta-Learning", "In-Context Learning", "Large Language Model"],
    vendors: ["OpenAI", "Google"]
  },
  {
    term: "Zero-Shot Learning",
    category: "AI/ML",
    definition: "A machine learning approach where models make predictions on tasks without seeing any training examples. Zero-shot learning relies on semantic knowledge and cross-task generalization from pre-training.",
    related: ["Few-Shot Learning", "Transfer Learning", "Large Language Model"],
    vendors: ["OpenAI", "Hugging Face"]
  },
  {
    term: "In-Context Learning",
    category: "AI/ML",
    definition: "A capability of large language models to learn from examples provided in the prompt context without gradient updates. In-context learning enables rapid adaptation and is a key feature of modern LLMs.",
    related: ["Few-Shot Learning", "Large Language Model", "Prompt Engineering"],
    vendors: ["OpenAI", "Google"]
  },
  {
    term: "Chain of Thought",
    abbr: "CoT",
    category: "AI/ML",
    definition: "A prompting technique that encourages language models to explain their reasoning step-by-step before providing an answer. Chain of thought prompting significantly improves performance on reasoning-heavy tasks.",
    related: ["Prompt Engineering", "Large Language Model", "Reasoning"],
    vendors: ["OpenAI", "Google", "Anthropic"]
  },

  /* ========== COMPUTER VISION ========== */
  {
    term: "Computer Vision",
    category: "AI/ML",
    definition: "A subfield of AI that enables machines to interpret and understand visual information from images and videos. Computer vision applications include object detection, image classification, segmentation and facial recognition.",
    related: ["Convolutional Neural Network", "Object Detection", "Image Classification", "Semantic Segmentation"],
    vendors: ["OpenCV", "PyTorch", "TensorFlow"]
  },
  {
    term: "Image Classification",
    category: "AI/ML",
    definition: "A computer vision task that assigns predefined categories to images. Image classification is fundamental for applications like content moderation, medical imaging and autonomous systems.",
    related: ["Computer Vision", "Convolutional Neural Network", "Deep Learning"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Object Detection",
    category: "AI/ML",
    definition: "A computer vision task that identifies and localizes objects within images by drawing bounding boxes. Object detection is crucial for autonomous vehicles, surveillance systems and inventory management.",
    related: ["Computer Vision", "Convolutional Neural Network", "YOLO", "R-CNN"],
    vendors: ["OpenCV", "PyTorch", "TensorFlow"]
  },
  {
    term: "YOLO",
    abbr: "YOLO",
    category: "AI/ML",
    definition: "You Only Look Once — a real-time object detection algorithm that frames detection as a single regression problem. YOLO is fast, accurate and widely used in production computer vision systems.",
    related: ["Object Detection", "Convolutional Neural Network", "Real-Time Detection"],
    vendors: ["Ultralytics"]
  },
  {
    term: "R-CNN",
    category: "AI/ML",
    definition: "Region-based Convolutional Neural Network — a family of object detection methods that first identify region proposals and then classify them. R-CNN variants (Fast R-CNN, Faster R-CNN) improved speed and accuracy.",
    related: ["Object Detection", "Convolutional Neural Network", "Region Proposal"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Semantic Segmentation",
    category: "AI/ML",
    definition: "A computer vision task that assigns a class label to each pixel in an image. Semantic segmentation is used in autonomous driving, medical imaging and scene understanding.",
    related: ["Computer Vision", "Image Segmentation", "Pixel-Wise Classification"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Instance Segmentation",
    category: "AI/ML",
    definition: "A computer vision task that identifies individual objects (instances) within an image and segments their boundaries. Instance segmentation combines object detection and semantic segmentation.",
    related: ["Semantic Segmentation", "Object Detection", "Mask R-CNN"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Panoptic Segmentation",
    category: "AI/ML",
    definition: "A unified computer vision task combining semantic and instance segmentation to label all pixels with both a class and instance ID. Panoptic segmentation provides comprehensive scene understanding.",
    related: ["Semantic Segmentation", "Instance Segmentation"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Face Recognition",
    category: "AI/ML",
    definition: "A computer vision task that identifies individuals from facial images. Face recognition uses deep learning to extract distinctive facial features and match them against a gallery of known faces.",
    related: ["Computer Vision", "Biometric Identification", "Facial Landmark Detection"],
    vendors: ["OpenCV", "DeepFace", "FaceNet"]
  },
  {
    term: "Pose Estimation",
    category: "AI/ML",
    definition: "A computer vision task that detects body joints and estimates the spatial configuration of human poses in images. Pose estimation is used in action recognition, fitness tracking and human-computer interaction.",
    related: ["Computer Vision", "Keypoint Detection", "Skeletal Tracking"],
    vendors: ["OpenPose", "MediaPipe"]
  },
  {
    term: "Depth Estimation",
    category: "AI/ML",
    definition: "A computer vision task that infers the depth (distance from camera) of pixels in an image. Depth estimation enables 3D scene reconstruction and is crucial for robotics and autonomous systems.",
    related: ["Computer Vision", "3D Reconstruction", "Stereo Vision"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Optical Character Recognition",
    abbr: "OCR",
    category: "AI/ML",
    definition: "A technology that converts images of printed or handwritten text into machine-readable digital text. OCR enables document digitization, information extraction and accessibility applications.",
    related: ["Computer Vision", "Text Detection", "Scene Text Recognition"],
    vendors: ["Tesseract", "PaddleOCR"]
  },

  /* ========== TRAINING & OPTIMIZATION ========== */
  {
    term: "Backpropagation",
    category: "AI/ML",
    definition: "An algorithm for computing gradients in neural networks by efficiently propagating errors backward through layers. Backpropagation enables training of deep networks and is fundamental to modern deep learning.",
    related: ["Gradient Descent", "Neural Network", "Chain Rule"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Gradient Descent",
    category: "AI/ML",
    definition: "An optimization algorithm that iteratively updates model parameters in the direction of steepest descent of the loss function. Gradient descent is the foundation of neural network training.",
    related: ["Backpropagation", "Optimization", "Learning Rate", "Convergence"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Stochastic Gradient Descent",
    abbr: "SGD",
    category: "AI/ML",
    definition: "A variant of gradient descent that updates parameters using gradients computed on mini-batches or single samples. SGD is computationally efficient and often achieves better generalization than batch gradient descent.",
    related: ["Gradient Descent", "Optimization", "Mini-Batch"],
    vendors: ["TensorFlow", "PyTorch", "Scikit-learn"]
  },
  {
    term: "Adam Optimizer",
    category: "AI/ML",
    definition: "Adaptive Moment Estimation — an optimization algorithm that combines advantages of momentum and RMSprop. Adam adapts learning rates for each parameter and is widely used for training deep learning models.",
    related: ["Gradient Descent", "Momentum", "RMSprop", "Optimization"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Momentum",
    category: "AI/ML",
    definition: "An optimization technique that accumulates gradients over time to accelerate convergence in consistent directions. Momentum helps escape local minima and stabilizes training in neural networks.",
    related: ["Gradient Descent", "Optimization", "Nesterov Momentum"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Learning Rate",
    category: "AI/ML",
    definition: "A hyperparameter that controls the step size taken by optimization algorithms. Learning rate is critical for training stability and convergence speed; too high causes divergence while too low causes slow convergence.",
    related: ["Gradient Descent", "Hyperparameter", "Learning Rate Scheduling"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Learning Rate Scheduling",
    category: "AI/ML",
    definition: "A technique that adjusts the learning rate during training according to a predefined schedule. Learning rate scheduling helps balance fast convergence early in training with fine-tuning later.",
    related: ["Learning Rate", "Optimization", "Warm-Up"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Batch Normalization",
    category: "AI/ML",
    definition: "A technique that normalizes inputs to neural network layers to have zero mean and unit variance. Batch normalization accelerates training, allows higher learning rates and acts as regularization.",
    related: ["Normalization", "Layer Normalization", "Neural Network"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Layer Normalization",
    category: "AI/ML",
    definition: "A normalization technique that normalizes inputs across features for each training example independently. Layer normalization is particularly effective in transformers and avoids issues with small batch sizes.",
    related: ["Batch Normalization", "Normalization"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Dropout",
    category: "AI/ML",
    definition: "A regularization technique that randomly deactivates neurons during training to prevent co-adaptation. Dropout acts as an ensemble method and significantly reduces overfitting without increasing computational cost.",
    related: ["Regularization", "Overfitting", "Regularization Techniques"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Early Stopping",
    category: "AI/ML",
    definition: "A regularization technique that halts training when validation performance stops improving. Early stopping prevents overfitting and saves computational resources.",
    related: ["Regularization", "Validation Set", "Overfitting"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "L1 Regularization",
    category: "AI/ML",
    definition: "A regularization technique that adds the sum of absolute parameter values to the loss function. L1 regularization encourages sparse solutions where many parameters become zero.",
    related: ["Regularization", "L2 Regularization", "Overfitting"],
    vendors: ["Scikit-learn", "TensorFlow"]
  },
  {
    term: "L2 Regularization",
    category: "AI/ML",
    definition: "A regularization technique that adds the sum of squared parameter values to the loss function. L2 regularization penalizes large weights and encourages solutions with small parameter values.",
    related: ["Regularization", "L1 Regularization", "Weight Decay", "Overfitting"],
    vendors: ["Scikit-learn", "TensorFlow"]
  },
  {
    term: "Weight Decay",
    category: "AI/ML",
    definition: "A regularization technique that reduces model parameters by a constant factor during each optimization step. Weight decay is equivalent to L2 regularization in gradient descent.",
    related: ["L2 Regularization", "Regularization", "Optimization"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Convergence",
    category: "AI/ML",
    definition: "The state reached when an optimization algorithm stops improving the loss function or reaches acceptable performance. Convergence analysis ensures training stability and efficiency.",
    related: ["Gradient Descent", "Loss Function", "Training"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Loss Function",
    category: "AI/ML",
    definition: "A mathematical function that quantifies the difference between predicted and actual values, guiding model learning. The choice of loss function determines what the model optimizes for.",
    related: ["Objective Function", "Optimization", "Backpropagation"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Cross-Entropy Loss",
    category: "AI/ML",
    definition: "A loss function commonly used for classification tasks that measures the difference between predicted probability distributions and actual labels. Cross-entropy is derived from information theory.",
    related: ["Loss Function", "Classification", "Softmax"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Mean Squared Error",
    abbr: "MSE",
    category: "AI/ML",
    definition: "A loss function that measures the average squared difference between predicted and actual values. MSE is commonly used for regression tasks and is sensitive to large errors.",
    related: ["Loss Function", "Regression", "Mean Absolute Error"],
    vendors: ["Scikit-learn", "TensorFlow"]
  },
  {
    term: "Vanishing Gradient Problem",
    category: "AI/ML",
    definition: "A phenomenon where gradients become exponentially small during backpropagation through many layers, making training very slow. LSTMs and skip connections are designed to mitigate this problem.",
    related: ["Gradient Descent", "Backpropagation", "LSTM", "ResNet"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Exploding Gradient Problem",
    category: "AI/ML",
    definition: "A phenomenon where gradients become exponentially large during backpropagation, causing numerical instability. Gradient clipping is commonly used to prevent exploding gradients.",
    related: ["Gradient Descent", "Vanishing Gradient Problem", "Gradient Clipping"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Gradient Clipping",
    category: "AI/ML",
    definition: "A technique that caps gradient values to a maximum threshold to prevent exploding gradients. Gradient clipping is particularly important for training RNNs and transformers.",
    related: ["Exploding Gradient Problem", "Gradient Descent"],
    vendors: ["TensorFlow", "PyTorch"]
  },

  /* ========== DATA & EVALUATION ========== */
  {
    term: "Training Data",
    category: "AI/ML",
    definition: "A dataset used to train machine learning models by adjusting parameters to fit the data. Quality and quantity of training data significantly impact model performance.",
    related: ["Validation Set", "Test Set", "Dataset", "Data Augmentation"],
    vendors: ["Various"]
  },
  {
    term: "Validation Set",
    category: "AI/ML",
    definition: "A dataset used to evaluate model performance during training and tune hyperparameters. The validation set helps prevent overfitting and guides early stopping.",
    related: ["Training Data", "Test Set", "Hyperparameter", "Cross-Validation"],
    vendors: ["Various"]
  },
  {
    term: "Test Set",
    category: "AI/ML",
    definition: "A dataset held out from training and used only for final evaluation of model performance. The test set provides an unbiased estimate of how well the model will perform on new data.",
    related: ["Training Data", "Validation Set", "Evaluation Metrics"],
    vendors: ["Various"]
  },
  {
    term: "Cross-Validation",
    category: "AI/ML",
    definition: "A technique for evaluating model performance by dividing data into k folds, training on k-1 folds and testing on the remaining fold. Cross-validation provides more robust performance estimates than a single train-test split.",
    related: ["Validation Set", "Test Set", "k-Fold", "Evaluation Metrics"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Data Augmentation",
    category: "AI/ML",
    definition: "A technique that artificially increases training data by applying transformations (rotation, flip, crop for images). Data augmentation improves model robustness and reduces overfitting when data is limited.",
    related: ["Training Data", "Overfitting", "Regularization"],
    vendors: ["Albumentations", "TorchVision"]
  },
  {
    term: "Imbalanced Data",
    category: "AI/ML",
    definition: "A dataset where classes are not equally represented, causing standard models to be biased toward the majority class. Techniques like oversampling, undersampling and cost-sensitive learning address this problem.",
    related: ["Class Imbalance", "Sampling", "Precision", "Recall"],
    vendors: ["Imbalanced-learn"]
  },
  {
    term: "Class Imbalance",
    category: "AI/ML",
    definition: "A scenario where some classes in a classification problem have far fewer examples than others. Class imbalance requires special handling such as stratified sampling or weighted loss functions.",
    related: ["Imbalanced Data", "Sampling", "Cost-Sensitive Learning"],
    vendors: ["Imbalanced-learn"]
  },
  {
    term: "Precision",
    category: "AI/ML",
    definition: "An evaluation metric for classification that measures the fraction of predicted positive examples that are actually positive. Precision is important when false positives are costly.",
    related: ["Recall", "F1-Score", "Confusion Matrix", "Classification Metrics"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Recall",
    category: "AI/ML",
    definition: "An evaluation metric for classification that measures the fraction of actual positive examples that are correctly predicted. Recall is important when false negatives are costly.",
    related: ["Precision", "F1-Score", "Confusion Matrix", "Classification Metrics"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "F1-Score",
    category: "AI/ML",
    definition: "An evaluation metric that is the harmonic mean of precision and recall, providing a balanced measure of classification performance. F1-score is useful for imbalanced datasets.",
    related: ["Precision", "Recall", "Classification Metrics"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Accuracy",
    category: "AI/ML",
    definition: "An evaluation metric that measures the fraction of correct predictions. While simple, accuracy can be misleading on imbalanced datasets.",
    related: ["Precision", "Recall", "Classification Metrics"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "ROC Curve",
    abbr: "ROC",
    category: "AI/ML",
    definition: "Receiver Operating Characteristic — a curve plotting true positive rate against false positive rate at various classification thresholds. ROC curves visualize classifier performance across thresholds.",
    related: ["AUC", "Classification Metrics", "Threshold"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "AUC",
    abbr: "AUC",
    category: "AI/ML",
    definition: "Area Under the Curve — typically refers to the area under the ROC curve, providing a single-number summary of classifier performance. AUC ranges from 0 to 1, with 1 representing perfect classification.",
    related: ["ROC Curve", "Classification Metrics"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Confusion Matrix",
    category: "AI/ML",
    definition: "A table summarizing classification results by showing true positives, false positives, true negatives and false negatives. The confusion matrix enables computation of multiple evaluation metrics.",
    related: ["Precision", "Recall", "Classification Metrics"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Mean Average Precision",
    abbr: "mAP",
    category: "AI/ML",
    definition: "An evaluation metric for object detection that averages the precision at different recall levels. mAP is the standard metric for evaluating detection models.",
    related: ["Precision", "Object Detection", "Evaluation Metrics"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "BLEU Score",
    category: "AI/ML",
    definition: "Bilingual Evaluation Understudy — a metric for evaluating machine translation quality by comparing n-gram overlap with reference translations. BLEU scores range from 0 to 1.",
    related: ["Machine Translation", "Evaluation Metrics"],
    vendors: ["NLTK"]
  },
  {
    term: "ROUGE Score",
    category: "AI/ML",
    definition: "Recall-Oriented Understudy for Gisting Evaluation — a family of metrics for evaluating text summarization and machine translation. ROUGE measures n-gram overlap between generated and reference text.",
    related: ["Text Summarization", "Machine Translation", "Evaluation Metrics"],
    vendors: ["NLTK"]
  },
  {
    term: "Perplexity",
    category: "AI/ML",
    definition: "An evaluation metric for language models that measures how well a probability model predicts a test sample. Lower perplexity indicates better predictions.",
    related: ["Language Model", "Evaluation Metrics"],
    vendors: ["NLTK", "Hugging Face"]
  },

  /* ========== CLUSTERING & DIMENSIONALITY ========== */
  {
    term: "Clustering",
    category: "AI/ML",
    definition: "An unsupervised learning task that groups similar data points into clusters without predefined labels. Clustering is used for customer segmentation, document organization and anomaly detection.",
    related: ["Unsupervised Learning", "K-Means", "Hierarchical Clustering", "DBSCAN"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "K-Means",
    category: "AI/ML",
    definition: "A clustering algorithm that partitions data into k clusters by minimizing within-cluster variance. K-Means is simple, scalable and widely used despite requiring k to be specified beforehand.",
    related: ["Clustering", "Centroid", "Euclidean Distance"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Hierarchical Clustering",
    category: "AI/ML",
    definition: "A clustering approach that builds a tree of clusters (dendrogram) by iteratively merging or splitting clusters. Hierarchical clustering provides intuitive visualizations and doesn't require specifying the number of clusters.",
    related: ["Clustering", "Dendrogram", "Agglomerative Clustering"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "DBSCAN",
    category: "AI/ML",
    definition: "Density-Based Spatial Clustering of Applications with Noise — a clustering algorithm that groups points based on density without requiring the number of clusters. DBSCAN can discover arbitrary-shaped clusters and identify outliers.",
    related: ["Clustering", "Density-Based Clustering", "Outlier Detection"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Dimensionality Reduction",
    category: "AI/ML",
    definition: "A technique that reduces the number of features in a dataset while preserving important information. Dimensionality reduction improves computational efficiency and visualization while reducing overfitting.",
    related: ["Feature Selection", "Principal Component Analysis", "t-SNE", "Autoencoder"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Principal Component Analysis",
    abbr: "PCA",
    category: "AI/ML",
    definition: "A linear dimensionality reduction technique that finds principal components (directions of maximum variance) in data. PCA is widely used for data visualization, noise reduction and feature engineering.",
    related: ["Dimensionality Reduction", "Feature Engineering", "Linear Transformation"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "t-SNE",
    category: "AI/ML",
    definition: "t-Distributed Stochastic Neighbor Embedding — a nonlinear dimensionality reduction technique particularly effective for visualization. t-SNE preserves local structure and creates visually interpretable 2D/3D embeddings.",
    related: ["Dimensionality Reduction", "Visualization", "UMAP"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "UMAP",
    category: "AI/ML",
    definition: "Uniform Manifold Approximation and Projection — a dimensionality reduction technique that preserves both local and global structure. UMAP is faster than t-SNE while producing similar or better visualizations.",
    related: ["Dimensionality Reduction", "t-SNE", "Visualization"],
    vendors: ["UMAP"]
  },
  {
    term: "Feature Engineering",
    category: "AI/ML",
    definition: "The process of creating new features from raw data to improve model performance. Effective feature engineering is often more important than algorithm selection for machine learning success.",
    related: ["Feature Selection", "Feature Extraction", "Feature Scaling"],
    vendors: ["Various"]
  },
  {
    term: "Feature Selection",
    category: "AI/ML",
    definition: "The process of choosing a subset of relevant features for model training. Feature selection reduces overfitting, improves interpretability and decreases computational cost.",
    related: ["Feature Engineering", "Dimensionality Reduction"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Feature Scaling",
    category: "AI/ML",
    definition: "A preprocessing technique that transforms features to a common scale (e.g., standardization or normalization). Feature scaling improves model convergence and prevents features with larger scales from dominating.",
    related: ["Feature Engineering", "Normalization", "Standardization"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Normalization",
    category: "AI/ML",
    definition: "A preprocessing technique that scales features to a fixed range (usually [0, 1]). Normalization is useful when the scale of features varies widely.",
    related: ["Feature Scaling", "Standardization"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Standardization",
    category: "AI/ML",
    definition: "A preprocessing technique that transforms features to have zero mean and unit variance. Standardization is often preferred for algorithms that assume normally distributed data.",
    related: ["Feature Scaling", "Normalization"],
    vendors: ["Scikit-learn"]
  },

  /* ========== ADVANCED TECHNIQUES ========== */
  {
    term: "Attention",
    category: "AI/ML",
    definition: "A neural network mechanism that allows models to focus on relevant parts of input by computing weighted combinations. Attention is fundamental to modern architectures and improves interpretability.",
    related: ["Transformer", "Self-Attention", "Multi-Head Attention"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Multi-Head Attention",
    category: "AI/ML",
    definition: "An attention variant that uses multiple attention heads in parallel, allowing models to attend to different representation subspaces. Multi-head attention is a key component of transformers.",
    related: ["Attention", "Transformer", "Self-Attention"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Sequence-to-Sequence",
    abbr: "Seq2Seq",
    category: "AI/ML",
    definition: "A neural network architecture consisting of an encoder that processes input and a decoder that generates output. Seq2seq models are foundational for machine translation, summarization and question answering.",
    related: ["Encoder", "Decoder", "Attention", "Transformer"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Encoder",
    category: "AI/ML",
    definition: "A neural network component that processes input data and produces a compact representation (encoding). Encoders are used in autoencoders, seq2seq models and embedding networks.",
    related: ["Decoder", "Representation Learning", "Embedding"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Decoder",
    category: "AI/ML",
    definition: "A neural network component that takes a compact representation and generates output data. Decoders are used in autoencoders, seq2seq models and generative models.",
    related: ["Encoder", "Sequence-to-Sequence", "Generative Model"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Generative Model",
    category: "AI/ML",
    definition: "A machine learning model that learns to generate new samples from a data distribution. Generative models include VAEs, GANs, diffusion models and autoregressive models.",
    related: ["Discriminative Model", "GAN", "VAE", "Diffusion Model"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Discriminative Model",
    category: "AI/ML",
    definition: "A machine learning model that learns to classify or distinguish between data samples. Discriminative models directly model the decision boundary between classes.",
    related: ["Generative Model", "Classification", "Supervised Learning"],
    vendors: ["Scikit-learn", "TensorFlow"]
  },
  {
    term: "Anomaly Detection",
    category: "AI/ML",
    definition: "A machine learning task that identifies unusual or anomalous patterns in data. Anomaly detection is used in fraud detection, system monitoring and quality control.",
    related: ["Unsupervised Learning", "Outlier Detection", "Autoencoder"],
    vendors: ["Scikit-learn", "PyOD"]
  },
  {
    term: "Outlier Detection",
    category: "AI/ML",
    definition: "A technique for identifying data points that deviate significantly from the normal pattern. Outlier detection is closely related to anomaly detection.",
    related: ["Anomaly Detection", "DBSCAN", "Isolation Forest"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Representation Learning",
    category: "AI/ML",
    definition: "The process of learning meaningful feature representations from raw data. Representation learning enables downstream tasks to benefit from learned abstractions.",
    related: ["Feature Learning", "Deep Learning", "Embedding"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Contrastive Learning",
    category: "AI/ML",
    definition: "A self-supervised learning approach that learns representations by contrasting similar and dissimilar samples. Contrastive learning has achieved strong results in computer vision and NLP.",
    related: ["Self-Supervised Learning", "Representation Learning", "SimCLR"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Self-Supervised Learning",
    category: "AI/ML",
    definition: "A learning paradigm where labels are automatically derived from unlabeled data itself. Self-supervised learning enables models to learn rich representations from massive unlabeled datasets.",
    related: ["Unsupervised Learning", "Contrastive Learning", "Masked Language Modeling"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Meta-Learning",
    category: "AI/ML",
    definition: "Learning how to learn — a paradigm where models are trained to quickly adapt to new tasks with few examples. Meta-learning is crucial for few-shot learning applications.",
    related: ["Few-Shot Learning", "Transfer Learning", "MAML"],
    vendors: ["PyTorch"]
  },
  {
    term: "Knowledge Distillation",
    category: "AI/ML",
    definition: "A technique where a smaller student model learns from a larger teacher model by matching its outputs. Knowledge distillation enables deployment of efficient models while maintaining performance.",
    related: ["Model Compression", "Transfer Learning"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Quantization",
    category: "AI/ML",
    definition: "A technique that reduces model size and computational requirements by representing weights and activations with lower precision. Quantization enables deployment on edge devices.",
    related: ["Model Compression", "Knowledge Distillation"],
    vendors: ["TensorFlow Lite", "ONNX"]
  },
  {
    term: "Pruning",
    category: "AI/ML",
    definition: "A model compression technique that removes less important weights or neurons from a trained model. Pruning reduces model size and inference latency with minimal performance loss.",
    related: ["Model Compression", "Quantization"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Model Compression",
    category: "AI/ML",
    definition: "A set of techniques including pruning, quantization and knowledge distillation to reduce model size. Model compression enables deployment on resource-constrained devices.",
    related: ["Pruning", "Quantization", "Knowledge Distillation"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Explainability",
    category: "AI/ML",
    definition: "The ability to understand and interpret why a machine learning model makes specific predictions. Explainability is crucial for building trust and meeting regulatory requirements.",
    related: ["Interpretability", "SHAP", "LIME"],
    vendors: ["SHAP", "Lime"]
  },
  {
    term: "Interpretability",
    category: "AI/ML",
    definition: "The degree to which humans can understand the reasoning behind model predictions. Interpretable models are preferred in high-stakes domains like healthcare and finance.",
    related: ["Explainability", "Feature Importance"],
    vendors: ["Various"]
  },
  {
    term: "SHAP",
    category: "AI/ML",
    definition: "SHapley Additive exPlanations — a game-theoretic approach to explaining model predictions based on cooperative game theory. SHAP values provide consistent and locally accurate model explanations.",
    related: ["Explainability", "Interpretability", "Feature Importance"],
    vendors: ["SHAP"]
  },
  {
    term: "LIME",
    category: "AI/ML",
    definition: "Local Interpretable Model-Agnostic Explanations — a technique that explains model predictions by fitting interpretable models around specific instances. LIME works with any black-box model.",
    related: ["Explainability", "Interpretability"],
    vendors: ["Lime"]
  },
  {
    term: "Feature Importance",
    category: "AI/ML",
    definition: "A measure of how much each feature contributes to model predictions. Feature importance helps identify influential features and aids model interpretation.",
    related: ["Interpretability", "SHAP", "Permutation Importance"],
    vendors: ["Scikit-learn"]
  },

  /* ========== BENCHMARK & METRICS ========== */
  {
    term: "Benchmark Dataset",
    category: "AI/ML",
    definition: "A standardized dataset used to evaluate and compare model performance. Benchmark datasets enable reproducible research and fair comparison across methods.",
    related: ["Dataset", "Evaluation Metrics", "ImageNet"],
    vendors: ["Various"]
  },
  {
    term: "ImageNet",
    category: "AI/ML",
    definition: "A large-scale visual database containing over 14 million images organized by WordNet. ImageNet has been instrumental in advancing computer vision through annual classification challenges.",
    related: ["Benchmark Dataset", "Computer Vision", "Object Classification"],
    vendors: ["Stanford University"]
  },
  {
    term: "MNIST",
    category: "AI/ML",
    definition: "A dataset of 70,000 handwritten digits (0-9) with 28x28 pixel grayscale images. MNIST is a classic benchmark for image classification and neural network research.",
    related: ["Benchmark Dataset", "Image Classification"],
    vendors: ["Yann LeCun"]
  },
  {
    term: "CIFAR-10",
    category: "AI/ML",
    definition: "A dataset of 60,000 32x32 pixel color images across 10 object categories (airplane, automobile, bird, etc.). CIFAR-10 is a popular benchmark for image classification research.",
    related: ["Benchmark Dataset", "Image Classification"],
    vendors: ["University of Toronto"]
  },
  {
    term: "COCO Dataset",
    category: "AI/ML",
    definition: "Common Objects in Context — a large-scale dataset with over 330,000 images containing object detection, instance segmentation and keypoint annotations. COCO is the standard benchmark for object detection.",
    related: ["Benchmark Dataset", "Object Detection", "Instance Segmentation"],
    vendors: ["Facebook AI"]
  },
  {
    term: "SQuAD",
    category: "AI/ML",
    definition: "Stanford Question Answering Dataset — a reading comprehension dataset with over 100,000 questions from Wikipedia articles. SQuAD is a standard benchmark for evaluating question answering systems.",
    related: ["Benchmark Dataset", "Question Answering"],
    vendors: ["Stanford University"]
  },

  /* ========== MODERN ARCHITECTURES & MODELS ========== */
  {
    term: "Diffusion Model",
    category: "AI/ML",
    definition: "A generative model that learns to remove noise from data iteratively. Diffusion models have achieved state-of-the-art results in image and text generation.",
    related: ["Generative Model", "Denoising", "Stable Diffusion"],
    vendors: ["OpenAI", "Stability AI"]
  },
  {
    term: "Stable Diffusion",
    category: "AI/ML",
    definition: "A text-to-image diffusion model that generates high-quality images from text descriptions. Stable Diffusion is open-source and efficient enough to run on consumer GPUs.",
    related: ["Diffusion Model", "Text-to-Image Generation"],
    vendors: ["Stability AI"]
  },
  {
    term: "EfficientNet",
    category: "AI/ML",
    definition: "A family of convolutional neural networks that achieve state-of-the-art accuracy with significantly fewer parameters and lower computational cost. EfficientNet uses compound scaling to balance model depth, width and resolution.",
    related: ["Convolutional Neural Network", "Image Classification"],
    vendors: ["Google", "TensorFlow"]
  },
  {
    term: "MobileNet",
    category: "AI/ML",
    definition: "A lightweight convolutional neural network architecture designed for mobile and edge devices. MobileNet uses depthwise separable convolutions to reduce parameters and computation.",
    related: ["Convolutional Neural Network", "Model Compression", "Edge AI"],
    vendors: ["Google", "TensorFlow"]
  },
  {
    term: "ViLBERT",
    category: "AI/ML",
    definition: "Vision and Language BERT — a pre-trained model for vision-language tasks that uses transformers to jointly process images and text. ViLBERT enables zero-shot and few-shot vision-language understanding.",
    related: ["Multimodal Learning", "Transformer", "BERT"],
    vendors: ["Facebook AI"]
  },
  {
    term: "CLIP",
    category: "AI/ML",
    definition: "Contrastive Language-Image Pre-Training — a model trained to understand relationships between images and text through contrastive learning. CLIP enables zero-shot image classification and retrieval.",
    related: ["Contrastive Learning", "Multimodal Learning", "Zero-Shot Learning"],
    vendors: ["OpenAI"]
  },
  {
    term: "Multimodal Learning",
    category: "AI/ML",
    definition: "A machine learning approach that integrates information from multiple modalities (vision, text, audio). Multimodal models enable understanding of complex relationships between different data types.",
    related: ["Vision-Language Model", "Audio-Visual Learning"],
    vendors: ["OpenAI", "Google", "Meta"]
  },
  {
    term: "Vision-Language Model",
    category: "AI/ML",
    definition: "A model that understands and generates content involving both images and text. Vision-language models enable applications like visual question answering and image captioning.",
    related: ["Multimodal Learning", "CLIP", "ViLBERT"],
    vendors: ["OpenAI", "Google"]
  },
  {
    term: "Speech Recognition",
    category: "AI/ML",
    definition: "A task that converts spoken audio into written text. Modern speech recognition uses deep learning and transformer-based models for high accuracy.",
    related: ["Natural Language Processing", "Audio Processing", "Wav2Vec"],
    vendors: ["Google", "OpenAI"]
  },
  {
    term: "Text-to-Speech",
    abbr: "TTS",
    category: "AI/ML",
    definition: "A task that synthesizes natural-sounding speech from text. Text-to-speech uses neural vocoders and attention mechanisms for high-quality speech generation.",
    related: ["Speech Synthesis", "Audio Generation"],
    vendors: ["Google", "Microsoft"]
  },
  {
    term: "Wav2Vec",
    category: "AI/ML",
    definition: "A self-supervised learning approach for speech representation learning that learns directly from raw waveforms. Wav2Vec has improved speech recognition performance across languages.",
    related: ["Speech Recognition", "Self-Supervised Learning"],
    vendors: ["Meta", "Facebook AI"]
  },

  /* ========== APPLICATIONS & SPECIALIZED ========== */
  {
    term: "Chatbot",
    category: "AI/ML",
    definition: "An AI system designed to simulate conversation with users through text or voice. Modern chatbots use large language models for natural and contextual interactions.",
    related: ["Large Language Model", "Natural Language Processing", "Question Answering"],
    vendors: ["OpenAI", "Google", "Meta"]
  },
  {
    term: "Recommendation System",
    category: "AI/ML",
    definition: "A machine learning system that predicts user preferences and suggests items they might like. Recommendation systems use collaborative filtering, content-based filtering and hybrid approaches.",
    related: ["Collaborative Filtering", "Content-Based Filtering", "Matrix Factorization"],
    vendors: ["Various"]
  },
  {
    term: "Collaborative Filtering",
    category: "AI/ML",
    definition: "A recommendation approach that suggests items based on the preferences of similar users or items. Collaborative filtering works by finding users with similar tastes and their preferences.",
    related: ["Recommendation System", "Content-Based Filtering"],
    vendors: ["Various"]
  },
  {
    term: "Content-Based Filtering",
    category: "AI/ML",
    definition: "A recommendation approach that suggests items similar to those the user has liked before. Content-based filtering analyzes item features to make recommendations.",
    related: ["Recommendation System", "Collaborative Filtering"],
    vendors: ["Various"]
  },
  {
    term: "Time Series Prediction",
    category: "AI/ML",
    definition: "A machine learning task that forecasts future values based on historical time series data. Time series prediction uses RNNs, transformers and statistical methods.",
    related: ["Recurrent Neural Network", "LSTM", "Forecasting"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Forecasting",
    category: "AI/ML",
    definition: "The prediction of future events or values based on historical data and trends. Forecasting is used in stock prediction, weather, demand planning and more.",
    related: ["Time Series Prediction", "Regression"],
    vendors: ["StatsForecast"]
  },
  {
    term: "Regression",
    category: "AI/ML",
    definition: "A supervised learning task that predicts continuous numeric values. Linear regression, polynomial regression and neural network regression are common approaches.",
    related: ["Supervised Learning", "Classification", "Linear Regression"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Classification",
    category: "AI/ML",
    definition: "A supervised learning task that assigns discrete categories to data points. Classification is used for email spam detection, disease diagnosis and many other applications.",
    related: ["Supervised Learning", "Binary Classification", "Multi-Class Classification"],
    vendors: ["Scikit-learn", "TensorFlow"]
  },
  {
    term: "Binary Classification",
    category: "AI/ML",
    definition: "A classification task with only two possible output classes. Binary classification is the simplest and most common form of classification.",
    related: ["Classification", "Logistic Regression", "Binary Classifier"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Multi-Class Classification",
    category: "AI/ML",
    definition: "A classification task with more than two possible output classes. Multi-class classification uses softmax activation and cross-entropy loss.",
    related: ["Classification", "Softmax", "Multi-Label Classification"],
    vendors: ["TensorFlow"]
  },
  {
    term: "Named Entity Linking",
    category: "AI/ML",
    definition: "An NLP task that links entity mentions in text to entries in a knowledge base. Named entity linking helps disambiguate and ground entities.",
    related: ["Named Entity Recognition", "Knowledge Graph", "Entity Disambiguation"],
    vendors: ["Hugging Face"]
  },
  {
    term: "Knowledge Graph",
    category: "AI/ML",
    definition: "A structured representation of knowledge as entities and relationships between them. Knowledge graphs enable semantic search, reasoning and question answering.",
    related: ["Named Entity Linking", "Semantic Web", "Knowledge Base"],
    vendors: ["Google", "DBpedia"]
  },
  {
    term: "Entity Embedding",
    category: "AI/ML",
    definition: "A continuous vector representation of entities learned from data. Entity embeddings enable similarity computation and downstream machine learning tasks.",
    related: ["Embedding", "Knowledge Graph", "Representation Learning"],
    vendors: ["Various"]
  },
  {
    term: "Semantic Search",
    category: "AI/ML",
    definition: "A search approach that understands the semantic meaning of queries and documents. Semantic search uses embeddings to find semantically similar content.",
    related: ["Embedding", "Information Retrieval", "Vector Search"],
    vendors: ["Various"]
  },
  {
    term: "Information Retrieval",
    category: "AI/ML",
    definition: "The field dealing with the retrieval of relevant documents or information from a collection. Information retrieval is foundational for search engines and recommendation systems.",
    related: ["Semantic Search", "Ranking", "BM25"],
    vendors: ["Elasticsearch", "Solr"]
  },
  {
    term: "Ranking",
    category: "AI/ML",
    definition: "A machine learning task that orders items by relevance to a query. Learning-to-rank models optimize ranking metrics like NDCG and MAP.",
    related: ["Information Retrieval", "Learning-to-Rank"],
    vendors: ["LightGBM"]
  },
  {
    term: "Learning-to-Rank",
    abbr: "LTR",
    category: "AI/ML",
    definition: "A machine learning approach for optimizing ranking of search results. Learning-to-rank uses pairwise or listwise loss functions to optimize ranking metrics.",
    related: ["Ranking", "Information Retrieval"],
    vendors: ["LightGBM", "XGBoost"]
  },

  /* ========== PROBABILISTIC MODELS ========== */
  {
    term: "Bayesian Network",
    category: "AI/ML",
    definition: "A probabilistic graphical model that represents conditional dependencies between random variables. Bayesian networks enable probabilistic inference and causal reasoning.",
    related: ["Probabilistic Model", "Graphical Model", "Conditional Probability"],
    vendors: ["PyMC", "Stan"]
  },
  {
    term: "Gaussian Mixture Model",
    abbr: "GMM",
    category: "AI/ML",
    definition: "A probabilistic model that represents data as a mixture of Gaussian distributions. GMMs are used for clustering and density estimation.",
    related: ["Probabilistic Model", "Clustering", "EM Algorithm"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Hidden Markov Model",
    abbr: "HMM",
    category: "AI/ML",
    definition: "A probabilistic model for sequential data where hidden states transition over time and emit observations. HMMs are used for speech recognition and sequence labeling.",
    related: ["Probabilistic Model", "Sequence Modeling", "Markov Chain"],
    vendors: ["Pomegranate"]
  },
  {
    term: "Markov Chain",
    category: "AI/ML",
    definition: "A stochastic model describing sequences of events where the probability of each event depends only on the previous state. Markov chains are used in text generation and sequence modeling.",
    related: ["Probabilistic Model", "Hidden Markov Model"],
    vendors: ["Various"]
  },
  {
    term: "Probabilistic Model",
    category: "AI/ML",
    definition: "A machine learning model that explicitly models probability distributions over data. Probabilistic models enable uncertainty quantification and principled inference.",
    related: ["Bayesian Network", "Gaussian Mixture Model", "Hidden Markov Model"],
    vendors: ["PyMC", "Stan"]
  },
  {
    term: "Expectation-Maximization",
    abbr: "EM",
    category: "AI/ML",
    definition: "An iterative algorithm for finding maximum likelihood estimates in models with latent variables. EM is widely used for clustering and learning probabilistic models.",
    related: ["Probabilistic Model", "Gaussian Mixture Model", "Likelihood"],
    vendors: ["Scikit-learn"]
  },

  /* ========== DEPLOYMENT & INFERENCE ========== */
  {
    term: "Model Serving",
    category: "AI/ML",
    definition: "The practice of deploying trained machine learning models to serve predictions in production. Model serving requires managing model versions, inference latency and throughput.",
    related: ["Model Deployment", "Inference", "API"],
    vendors: ["TensorFlow Serving", "TorchServe", "KServe"]
  },
  {
    term: "Inference",
    category: "AI/ML",
    definition: "The process of using a trained model to make predictions on new data. Inference is typically faster than training as it doesn't require gradient computation.",
    related: ["Model Serving", "Prediction", "Batch Inference"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Batch Inference",
    category: "AI/ML",
    definition: "Making predictions on multiple data points simultaneously rather than one at a time. Batch inference is more efficient than online inference for throughput-optimized scenarios.",
    related: ["Inference", "Real-Time Inference"],
    vendors: ["Various"]
  },
  {
    term: "Real-Time Inference",
    category: "AI/ML",
    definition: "Making predictions with low latency requirements for individual requests. Real-time inference requires optimized models and efficient serving infrastructure.",
    related: ["Inference", "Latency", "Model Serving"],
    vendors: ["TensorFlow Serving"]
  },
  {
    term: "Model Drift",
    category: "AI/ML",
    definition: "A phenomenon where model performance degrades over time due to changes in data distribution. Detecting and addressing model drift is crucial for maintaining production ML systems.",
    related: ["Concept Drift", "Data Drift", "Monitoring"],
    vendors: ["Evidently AI"]
  },
  {
    term: "Data Drift",
    category: "AI/ML",
    definition: "A change in the statistical distribution of input data over time. Data drift causes model performance degradation if not detected and addressed.",
    related: ["Model Drift", "Concept Drift"],
    vendors: ["Evidently AI"]
  },
  {
    term: "Concept Drift",
    category: "AI/ML",
    definition: "A change in the relationship between inputs and outputs over time. Concept drift makes historical patterns less relevant for future predictions.",
    related: ["Model Drift", "Data Drift"],
    vendors: ["Evidently AI"]
  },
  {
    term: "A/B Testing",
    category: "AI/ML",
    definition: "A statistical experiment comparing two versions of a model or system. A/B testing is essential for validating model improvements in production.",
    related: ["Experimentation", "Hypothesis Testing", "Statistical Significance"],
    vendors: ["Various"]
  },
  {
    term: "Canary Deployment",
    category: "AI/ML",
    definition: "A deployment strategy that gradually rolls out a new model to a small percentage of users before full deployment. Canary deployment enables safe testing of model updates.",
    related: ["Model Deployment", "Blue-Green Deployment"],
    vendors: ["Various"]
  },
  {
    term: "Blue-Green Deployment",
    category: "AI/ML",
    definition: "A deployment strategy maintaining two identical production environments where one is active and the other is standby. Blue-green deployment enables instant rollback.",
    related: ["Model Deployment", "Canary Deployment"],
    vendors: ["Various"]
  },

  /* ========== TOOLS & FRAMEWORKS ========== */
  {
    term: "TensorFlow",
    category: "AI/ML",
    definition: "An open-source machine learning framework developed by Google for building and training neural networks. TensorFlow supports distributed training, deployment and research applications.",
    related: ["Machine Learning Framework", "PyTorch", "Keras"],
    vendors: ["Google"]
  },
  {
    term: "PyTorch",
    category: "AI/ML",
    definition: "An open-source machine learning framework developed by Meta with dynamic computation graphs. PyTorch is popular in research for its flexibility and ease of use.",
    related: ["Machine Learning Framework", "TensorFlow"],
    vendors: ["Meta"]
  },
  {
    term: "Keras",
    category: "AI/ML",
    definition: "A high-level neural networks API that runs on top of TensorFlow, Theano and CNTK. Keras simplifies model building with a user-friendly interface.",
    related: ["TensorFlow", "Machine Learning Framework"],
    vendors: ["TensorFlow"]
  },
  {
    term: "Scikit-learn",
    category: "AI/ML",
    definition: "A Python library for machine learning with simple and efficient tools for data analysis and modeling. Scikit-learn is widely used for classical machine learning tasks.",
    related: ["Machine Learning Framework", "Python Libraries"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Hugging Face",
    category: "AI/ML",
    definition: "A platform and library for building, sharing and using pre-trained language and multimodal models. Hugging Face hosts thousands of open-source models.",
    related: ["Natural Language Processing", "Model Hub", "Transformers Library"],
    vendors: ["Hugging Face"]
  },
  {
    term: "OpenAI",
    category: "AI/ML",
    definition: "A research organization developing and deploying large-scale AI systems. OpenAI created GPT models and operates the popular ChatGPT and API services.",
    related: ["Large Language Model", "Artificial Intelligence"],
    vendors: ["OpenAI"]
  },
  {
    term: "Google DeepMind",
    category: "AI/ML",
    definition: "A research lab combining Google's DeepMind and Brain teams focused on AI research. DeepMind has created AlphaGo, AlphaFold and other breakthrough AI systems.",
    related: ["Artificial Intelligence", "Research"],
    vendors: ["Google"]
  },
  {
    term: "Meta AI",
    category: "AI/ML",
    definition: "Meta's artificial intelligence research organization. Meta AI develops models, tools and infrastructure for machine learning research and applications.",
    related: ["Artificial Intelligence", "Research"],
    vendors: ["Meta"]
  },
  {
    term: "XGBoost",
    category: "AI/ML",
    definition: "An open-source gradient boosting framework for regression and classification. XGBoost is highly effective and widely used in machine learning competitions.",
    related: ["Gradient Boosting", "Machine Learning"],
    vendors: ["XGBoost"]
  },
  {
    term: "LightGBM",
    category: "AI/ML",
    definition: "A fast, distributed gradient boosting framework for classification, regression and ranking. LightGBM uses leaf-wise tree growth for improved efficiency.",
    related: ["Gradient Boosting", "Machine Learning"],
    vendors: ["Microsoft"]
  },

  /* ========== CONCEPTS & THEORY ========== */
  {
    term: "Overfitting",
    category: "AI/ML",
    definition: "A phenomenon where a model learns the training data too well, including noise, resulting in poor generalization. Overfitting is prevented through regularization, early stopping and validation.",
    related: ["Generalization", "Underfitting", "Regularization"],
    vendors: ["Various"]
  },
  {
    term: "Underfitting",
    category: "AI/ML",
    definition: "A phenomenon where a model is too simple to capture the underlying patterns in data. Underfitting results in poor performance on both training and test data.",
    related: ["Overfitting", "Generalization", "Model Complexity"],
    vendors: ["Various"]
  },
  {
    term: "Generalization",
    category: "AI/ML",
    definition: "The ability of a machine learning model to perform well on unseen data. Good generalization is the ultimate goal of model training.",
    related: ["Overfitting", "Test Set", "Validation"],
    vendors: ["Various"]
  },
  {
    term: "Bias-Variance Tradeoff",
    category: "AI/ML",
    definition: "A fundamental concept in machine learning where bias (underfitting) and variance (overfitting) have an inverse relationship. Balancing bias and variance is key to good model performance.",
    related: ["Bias", "Variance", "Overfitting", "Underfitting"],
    vendors: ["Various"]
  },
  {
    term: "Bias",
    category: "AI/ML",
    definition: "In machine learning, the error from overly simplistic models that underfit. Bias represents systematic errors in model predictions.",
    related: ["Bias-Variance Tradeoff", "Variance", "Error"],
    vendors: ["Various"]
  },
  {
    term: "Variance",
    category: "AI/ML",
    definition: "In machine learning, the sensitivity of a model to fluctuations in training data. High variance leads to overfitting where models fit noise in data.",
    related: ["Bias-Variance Tradeoff", "Bias", "Overfitting"],
    vendors: ["Various"]
  },
  {
    term: "Activation Function",
    category: "AI/ML",
    definition: "A mathematical function applied to neural network outputs to introduce nonlinearity. Common activation functions include ReLU, Sigmoid and Tanh.",
    related: ["Neural Network", "ReLU", "Sigmoid"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "ReLU",
    category: "AI/ML",
    definition: "Rectified Linear Unit — an activation function that outputs zero for negative inputs and the input value for positive inputs. ReLU is simple, fast and widely used in deep networks.",
    related: ["Activation Function", "Neural Network"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Sigmoid",
    category: "AI/ML",
    definition: "An activation function that maps inputs to a value between 0 and 1. Sigmoid is commonly used in the output layer for binary classification.",
    related: ["Activation Function", "Logistic Function"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Softmax",
    category: "AI/ML",
    definition: "An activation function that converts a vector of values to a probability distribution. Softmax is used in multi-class classification to produce output probabilities.",
    related: ["Activation Function", "Multi-Class Classification", "Probability"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Weight Initialization",
    category: "AI/ML",
    definition: "The process of setting initial weights in neural networks before training. Proper weight initialization affects convergence speed and training stability.",
    related: ["Neural Network", "Training", "Xavier Initialization"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Xavier Initialization",
    category: "AI/ML",
    definition: "A weight initialization scheme that maintains activation and gradient magnitudes across layers. Xavier initialization improves training of deep networks.",
    related: ["Weight Initialization", "He Initialization"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Hyperparameter",
    category: "AI/ML",
    definition: "A parameter set before training that controls the learning process. Examples include learning rate, batch size, and network architecture choices.",
    related: ["Hyperparameter Tuning", "Learning Rate", "Batch Size"],
    vendors: ["Various"]
  },
  {
    term: "Hyperparameter Tuning",
    category: "AI/ML",
    definition: "The process of finding optimal hyperparameter values to maximize model performance. Hyperparameter tuning uses techniques like grid search and random search.",
    related: ["Hyperparameter", "Grid Search", "Random Search"],
    vendors: ["Optuna", "Ray Tune"]
  },
  {
    term: "Grid Search",
    category: "AI/ML",
    definition: "A hyperparameter optimization technique that exhaustively searches over a specified parameter grid. Grid search is simple but computationally expensive for large search spaces.",
    related: ["Hyperparameter Tuning", "Random Search"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Random Search",
    category: "AI/ML",
    definition: "A hyperparameter optimization technique that samples randomly from hyperparameter distributions. Random search is more efficient than grid search for high-dimensional spaces.",
    related: ["Hyperparameter Tuning", "Grid Search"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Batch Size",
    category: "AI/ML",
    definition: "The number of samples processed before updating model parameters during training. Batch size affects memory usage, convergence speed and generalization.",
    related: ["Hyperparameter", "Training", "Mini-Batch"],
    vendors: ["Various"]
  },
  {
    term: "Epoch",
    category: "AI/ML",
    definition: "One complete pass through the training dataset during model training. Models typically require multiple epochs to converge.",
    related: ["Training", "Iteration", "Convergence"],
    vendors: ["Various"]
  },
  {
    term: "Iteration",
    category: "AI/ML",
    definition: "A single update of model parameters based on a mini-batch of training data. Multiple iterations occur within each epoch.",
    related: ["Epoch", "Training", "Mini-Batch"],
    vendors: ["Various"]
  },

  /* ========== ADDITIONAL ADVANCED TOPICS ========== */
  {
    term: "Logistic Regression",
    category: "AI/ML",
    definition: "A linear classification algorithm that models the probability of binary outcomes using the logistic function. Despite its name, logistic regression is a classification method, not regression.",
    related: ["Classification", "Linear Model", "Sigmoid"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Decision Tree",
    category: "AI/ML",
    definition: "A tree-based model that makes predictions by learning a series of if-then-else decision rules. Decision trees are interpretable and form the basis for ensemble methods like random forests.",
    related: ["Random Forest", "Classification", "Regression"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Random Forest",
    category: "AI/ML",
    definition: "An ensemble method that combines multiple decision trees trained on random subsets of data. Random forests reduce overfitting and improve generalization.",
    related: ["Decision Tree", "Ensemble Learning", "Bagging"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Gradient Boosting",
    category: "AI/ML",
    definition: "An ensemble method that sequentially builds trees, each correcting errors made by previous trees. Gradient boosting achieves state-of-the-art performance on many tabular datasets.",
    related: ["Ensemble Learning", "XGBoost", "Decision Tree"],
    vendors: ["XGBoost", "LightGBM"]
  },
  {
    term: "Ensemble Learning",
    category: "AI/ML",
    definition: "A machine learning approach that combines multiple models to make better predictions. Ensemble methods typically outperform individual models.",
    related: ["Random Forest", "Gradient Boosting", "Bagging", "Boosting"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Bagging",
    category: "AI/ML",
    definition: "Bootstrap Aggregating — an ensemble method that trains models on random samples with replacement. Bagging reduces variance and enables parallel training.",
    related: ["Ensemble Learning", "Bootstrap", "Random Forest"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Boosting",
    category: "AI/ML",
    definition: "An ensemble method that sequentially trains models, giving more weight to misclassified examples. Boosting reduces both bias and variance.",
    related: ["Ensemble Learning", "AdaBoost", "Gradient Boosting"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "AdaBoost",
    category: "AI/ML",
    definition: "Adaptive Boosting — an ensemble method that adjusts sample weights to focus on hard-to-classify examples. AdaBoost often achieves better generalization than individual classifiers.",
    related: ["Boosting", "Ensemble Learning"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Support Vector Machine",
    abbr: "SVM",
    category: "AI/ML",
    definition: "A discriminative classifier that finds the hyperplane maximizing the margin between classes. SVMs work well for binary classification and can handle non-linear problems with kernel tricks.",
    related: ["Classification", "Kernel Method", "Hyperplane"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Kernel Method",
    category: "AI/ML",
    definition: "A technique that implicitly maps data to higher-dimensional spaces without explicit computation. Kernel methods enable non-linear learning in algorithms like SVMs.",
    related: ["Support Vector Machine", "Kernel Trick", "Non-Linear Learning"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Kernel Trick",
    category: "AI/ML",
    definition: "A mathematical technique that enables efficient computation in high-dimensional spaces by computing dot products in the original space. The kernel trick is foundational for many non-linear algorithms.",
    related: ["Kernel Method", "Support Vector Machine"],
    vendors: ["Various"]
  },
  {
    term: "Hyperplane",
    category: "AI/ML",
    definition: "A subspace with dimension one less than the ambient space that divides space into two half-spaces. Hyperplanes are used as decision boundaries in linear classifiers.",
    related: ["Support Vector Machine", "Classification"],
    vendors: ["Various"]
  },
  {
    term: "Margin",
    category: "AI/ML",
    definition: "The distance from the decision boundary to the nearest training examples. Maximizing the margin improves model robustness and generalization.",
    related: ["Support Vector Machine", "Classification"],
    vendors: ["Various"]
  },
  {
    term: "Naive Bayes",
    category: "AI/ML",
    definition: "A probabilistic classifier based on Bayes' theorem that assumes feature independence. Despite the naive assumption, Naive Bayes often works well for text and spam classification.",
    related: ["Probabilistic Model", "Classification", "Bayes' Theorem"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Bayes' Theorem",
    category: "AI/ML",
    definition: "A mathematical formula describing how to update probabilities given new evidence. Bayes' theorem is fundamental to probabilistic reasoning and Bayesian statistics.",
    related: ["Probabilistic Model", "Naive Bayes", "Conditional Probability"],
    vendors: ["Various"]
  },
  {
    term: "Conditional Probability",
    category: "AI/ML",
    definition: "The probability of an event given that another event has occurred. Conditional probability is denoted as P(A|B) and is fundamental to probabilistic modeling.",
    related: ["Probability", "Bayes' Theorem"],
    vendors: ["Various"]
  },
  {
    term: "Maximum Likelihood Estimation",
    abbr: "MLE",
    category: "AI/ML",
    definition: "A statistical method for estimating model parameters by finding values that maximize the likelihood of observed data. MLE is widely used in machine learning.",
    related: ["Likelihood", "Parameter Estimation", "Probabilistic Model"],
    vendors: ["Various"]
  },
  {
    term: "Likelihood",
    category: "AI/ML",
    definition: "The probability of observing data given a particular set of model parameters. Likelihood is used to optimize model parameters.",
    related: ["Maximum Likelihood Estimation", "Probability"],
    vendors: ["Various"]
  },
  {
    term: "Posterior Distribution",
    category: "AI/ML",
    definition: "In Bayesian statistics, the probability distribution of parameters given observed data. The posterior combines prior beliefs with evidence from data.",
    related: ["Bayesian Inference", "Prior Distribution", "Bayes' Theorem"],
    vendors: ["PyMC"]
  },
  {
    term: "Prior Distribution",
    category: "AI/ML",
    definition: "In Bayesian statistics, the probability distribution representing beliefs about parameters before observing data. The prior is updated with data to obtain the posterior.",
    related: ["Bayesian Inference", "Posterior Distribution"],
    vendors: ["PyMC"]
  },
  {
    term: "Bayesian Inference",
    category: "AI/ML",
    definition: "A statistical method for updating beliefs about parameters as new evidence arrives. Bayesian inference uses prior distributions, likelihood and Bayes' theorem.",
    related: ["Bayes' Theorem", "Posterior Distribution", "Prior Distribution"],
    vendors: ["PyMC", "Stan"]
  },
  {
    term: "Monte Carlo Method",
    category: "AI/ML",
    definition: "A computational technique using random sampling to approximate solutions to mathematical problems. Monte Carlo methods are used for inference in probabilistic models.",
    related: ["MCMC", "Sampling", "Stochastic"],
    vendors: ["PyMC"]
  },
  {
    term: "Markov Chain Monte Carlo",
    abbr: "MCMC",
    category: "AI/ML",
    definition: "A sampling technique that uses Markov chains to draw samples from complex probability distributions. MCMC is widely used for Bayesian inference.",
    related: ["Monte Carlo Method", "Markov Chain", "Bayesian Inference"],
    vendors: ["PyMC", "Stan"]
  },
  {
    term: "Isolation Forest",
    category: "AI/ML",
    definition: "An anomaly detection algorithm that isolates anomalies by randomly selecting features and split values. Isolation Forest is effective and efficient for high-dimensional data.",
    related: ["Anomaly Detection", "Outlier Detection"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Local Outlier Factor",
    abbr: "LOF",
    category: "AI/ML",
    definition: "An anomaly detection algorithm that identifies outliers by comparing local density of points. LOF works well for multimodal distributions.",
    related: ["Anomaly Detection", "Density-Based Clustering"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "One-Class SVM",
    category: "AI/ML",
    definition: "A variant of support vector machines for unsupervised anomaly detection. One-class SVM finds the smallest hypersphere containing most training data.",
    related: ["Anomaly Detection", "Support Vector Machine"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Isolation Forest Anomaly Detection",
    category: "AI/ML",
    definition: "An unsupervised anomaly detection approach using isolation forests that partition data randomly. The algorithm assumes anomalies are isolated and easier to separate.",
    related: ["Anomaly Detection", "Isolation Forest"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Matrix Factorization",
    category: "AI/ML",
    definition: "A technique for decomposing matrices into products of smaller matrices. Matrix factorization is used in recommendation systems and dimensionality reduction.",
    related: ["Dimensionality Reduction", "Recommendation System", "Singular Value Decomposition"],
    vendors: ["Various"]
  },
  {
    term: "Singular Value Decomposition",
    abbr: "SVD",
    category: "AI/ML",
    definition: "A matrix factorization technique that decomposes matrices into orthogonal matrices and singular values. SVD is used for dimensionality reduction and noise removal.",
    related: ["Matrix Factorization", "Linear Algebra"],
    vendors: ["Scikit-learn", "NumPy"]
  },
  {
    term: "Non-Negative Matrix Factorization",
    abbr: "NMF",
    category: "AI/ML",
    definition: "A matrix factorization technique where factors are constrained to be non-negative. NMF is useful for interpretable dimensionality reduction and topic modeling.",
    related: ["Matrix Factorization", "Topic Modeling"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Topic Modeling",
    category: "AI/ML",
    definition: "An unsupervised learning technique that discovers abstract topics in documents. Latent Dirichlet Allocation (LDA) is a popular topic modeling approach.",
    related: ["Unsupervised Learning", "LDA", "Document Analysis"],
    vendors: ["Gensim"]
  },
  {
    term: "Latent Dirichlet Allocation",
    abbr: "LDA",
    category: "AI/ML",
    definition: "A probabilistic model for topic modeling that represents documents as mixtures of topics. LDA is widely used for understanding document collections.",
    related: ["Topic Modeling", "Probabilistic Model"],
    vendors: ["Gensim"]
  },
  {
    term: "Document Similarity",
    category: "AI/ML",
    definition: "A measure of how similar two documents are based on their content. Document similarity is computed using embeddings, TF-IDF or other representation methods.",
    related: ["Semantic Similarity", "Text Representation"],
    vendors: ["Gensim", "Scikit-learn"]
  },
  {
    term: "TF-IDF",
    category: "AI/ML",
    definition: "Term Frequency-Inverse Document Frequency — a numerical statistic that reflects how important a word is to a document in a collection. TF-IDF is used for text representation and ranking.",
    related: ["Text Representation", "Information Retrieval"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Cosine Similarity",
    category: "AI/ML",
    definition: "A similarity measure that computes the cosine of the angle between two vectors. Cosine similarity is widely used for comparing document embeddings and text vectors.",
    related: ["Semantic Similarity", "Vector Space", "Distance Metric"],
    vendors: ["Scikit-learn", "SciPy"]
  },
  {
    term: "Euclidean Distance",
    category: "AI/ML",
    definition: "A distance metric computing the straight-line distance between two points. Euclidean distance is commonly used in clustering and nearest-neighbor algorithms.",
    related: ["Distance Metric", "Similarity", "K-Means"],
    vendors: ["Scikit-learn", "SciPy"]
  },
  {
    term: "Manhattan Distance",
    category: "AI/ML",
    definition: "A distance metric computing the sum of absolute differences (L1 norm). Manhattan distance is useful when movement is restricted to grid-like structures.",
    related: ["Distance Metric", "Euclidean Distance"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Distance Metric",
    category: "AI/ML",
    definition: "A mathematical function measuring the distance between data points. Choice of distance metric affects clustering, classification and similarity computation.",
    related: ["Euclidean Distance", "Manhattan Distance", "Cosine Similarity"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Semantic Similarity",
    category: "AI/ML",
    definition: "A measure of how similar the meanings of two text snippets are. Semantic similarity is computed using embeddings and word vector representations.",
    related: ["Embedding", "Document Similarity", "Cosine Similarity"],
    vendors: ["Sentence Transformers"]
  },
  {
    term: "Siamese Network",
    category: "AI/ML",
    definition: "A neural network architecture with two or more identical subnetworks used to compare inputs. Siamese networks are effective for similarity learning and face recognition.",
    related: ["Metric Learning", "Contrastive Learning"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Metric Learning",
    category: "AI/ML",
    definition: "A machine learning approach that learns distance metrics to improve similarity computation. Metric learning is used for face recognition and person re-identification.",
    related: ["Siamese Network", "Contrastive Learning", "Distance Metric"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Person Re-identification",
    abbr: "Re-ID",
    category: "AI/ML",
    definition: "A computer vision task that identifies the same person across multiple camera views. Re-ID uses metric learning and appearance features.",
    related: ["Computer Vision", "Metric Learning", "Face Recognition"],
    vendors: ["Various"]
  },
  {
    term: "Cross-Modal Retrieval",
    category: "AI/ML",
    definition: "A retrieval task that finds items in one modality (e.g., images) given queries in another modality (e.g., text). Cross-modal retrieval uses multimodal embeddings.",
    related: ["Multimodal Learning", "Information Retrieval", "Embedding"],
    vendors: ["Various"]
  },
  {
    term: "Image Captioning",
    category: "AI/ML",
    definition: "A task that generates natural language descriptions of images. Image captioning combines computer vision and natural language generation.",
    related: ["Computer Vision", "Natural Language Processing", "Sequence-to-Sequence"],
    vendors: ["Various"]
  },
  {
    term: "Visual Question Answering",
    abbr: "VQA",
    category: "AI/ML",
    definition: "A task that answers questions about images using computer vision and natural language understanding. VQA combines vision and language for complex reasoning.",
    related: ["Multimodal Learning", "Question Answering", "Computer Vision"],
    vendors: ["Various"]
  },
  {
    term: "Action Recognition",
    category: "AI/ML",
    definition: "A computer vision task that identifies human actions in videos. Action recognition uses 3D CNNs and temporal convolutions.",
    related: ["Computer Vision", "Temporal Modeling", "Video Analysis"],
    vendors: ["PyTorch", "OpenCV"]
  },
  {
    term: "Temporal Modeling",
    category: "AI/ML",
    definition: "A technique for capturing temporal dynamics and dependencies in sequential or video data. Temporal modeling is crucial for action recognition and video understanding.",
    related: ["Recurrent Neural Network", "3D Convolution", "Action Recognition"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "3D Convolution",
    abbr: "3D CNN",
    category: "AI/ML",
    definition: "A convolution operation that extends 2D convolutions to three dimensions (height, width, time). 3D CNNs are used for video analysis and volumetric data.",
    related: ["Convolutional Neural Network", "Temporal Modeling", "Video Analysis"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Optical Flow",
    category: "AI/ML",
    definition: "A technique that estimates pixel motion between consecutive video frames. Optical flow is used for action recognition, video compression and motion analysis.",
    related: ["Computer Vision", "Motion Estimation", "Video Analysis"],
    vendors: ["OpenCV"]
  },
  {
    term: "Video Analysis",
    category: "AI/ML",
    definition: "The application of computer vision techniques to understand and extract information from video sequences. Video analysis includes action recognition, tracking and summarization.",
    related: ["Computer Vision", "Action Recognition", "Temporal Modeling"],
    vendors: ["OpenCV", "PyTorch"]
  },
  {
    term: "Object Tracking",
    category: "AI/ML",
    definition: "A computer vision task that follows objects across video frames. Object tracking is used in surveillance, robotics and video analysis.",
    related: ["Computer Vision", "Video Analysis", "Object Detection"],
    vendors: ["OpenCV", "SORT"]
  },
  {
    term: "Scene Understanding",
    category: "AI/ML",
    definition: "The task of comprehensively understanding visual scenes including objects, relationships and contexts. Scene understanding requires multiple computer vision tasks.",
    related: ["Computer Vision", "Object Detection", "Semantic Segmentation"],
    vendors: ["Various"]
  },
  {
    term: "3D Reconstruction",
    category: "AI/ML",
    definition: "A computer vision task that builds 3D models from 2D images or point clouds. 3D reconstruction is used in robotics, augmented reality and autonomous systems.",
    related: ["Computer Vision", "Depth Estimation", "Point Cloud"],
    vendors: ["OpenCV", "COLMAP"]
  },
  {
    term: "Point Cloud",
    category: "AI/ML",
    definition: "A set of 3D points in space representing the geometry of a scene or object. Point clouds are acquired by depth sensors and used in 3D vision tasks.",
    related: ["3D Reconstruction", "Depth Estimation", "3D Detection"],
    vendors: ["PCL", "Open3D"]
  },
  {
    term: "3D Object Detection",
    category: "AI/ML",
    definition: "A computer vision task that detects and localizes objects in 3D space from images or point clouds. 3D object detection is crucial for autonomous driving.",
    related: ["Object Detection", "Point Cloud", "3D Reconstruction"],
    vendors: ["PyTorch", "OpenPCDet"]
  },
  {
    term: "Autonomous Driving",
    category: "AI/ML",
    definition: "A computer vision and AI application enabling vehicles to perceive, navigate and control themselves without human input. Autonomous driving uses multiple computer vision and sensor fusion techniques.",
    related: ["Computer Vision", "Sensor Fusion", "Object Detection"],
    vendors: ["Various"]
  },
  {
    term: "Sensor Fusion",
    category: "AI/ML",
    definition: "A technique that combines data from multiple sensors to create a more accurate and robust representation. Sensor fusion is critical for autonomous systems.",
    related: ["Autonomous Driving", "Data Integration"],
    vendors: ["Various"]
  },
  {
    term: "Robotics",
    category: "AI/ML",
    definition: "A field combining mechanical engineering and AI to build systems that perceive and interact with the environment. Robotics uses computer vision, control theory and machine learning.",
    related: ["Computer Vision", "Control Theory", "Sensor Fusion"],
    vendors: ["ROS", "PyTorch"]
  },
  {
    term: "Reinforcement Learning Agent",
    category: "AI/ML",
    definition: "An entity that learns to take actions in an environment to maximize cumulative rewards. Reinforcement learning agents are used in robotics, games and autonomous systems.",
    related: ["Reinforcement Learning", "Robotics", "Policy"],
    vendors: ["OpenAI Gym"]
  },
  {
    term: "Policy",
    category: "AI/ML",
    definition: "In reinforcement learning, a function that maps states to actions, determining agent behavior. Policies can be deterministic or stochastic.",
    related: ["Reinforcement Learning", "Policy Gradient", "Value Function"],
    vendors: ["Various"]
  },
  {
    term: "Value Function",
    category: "AI/ML",
    definition: "In reinforcement learning, a function that estimates the expected future reward for a state or state-action pair. Value functions guide decision-making.",
    related: ["Reinforcement Learning", "Q-Learning", "Policy Gradient"],
    vendors: ["Various"]
  },
  {
    term: "Q-Learning",
    category: "AI/ML",
    definition: "A reinforcement learning algorithm that learns an optimal action-value function (Q-function) through interactions with the environment. Q-learning is model-free and off-policy.",
    related: ["Reinforcement Learning", "Value Function", "Temporal Difference Learning"],
    vendors: ["OpenAI Gym"]
  },
  {
    term: "Policy Gradient",
    category: "AI/ML",
    definition: "A reinforcement learning algorithm that directly optimizes the policy by following the gradient of expected rewards. Policy gradient methods include REINFORCE and Actor-Critic.",
    related: ["Reinforcement Learning", "Policy", "Gradient"],
    vendors: ["OpenAI", "PyTorch"]
  },
  {
    term: "Actor-Critic",
    category: "AI/ML",
    definition: "A reinforcement learning algorithm combining policy gradient (actor) and value function (critic) methods. Actor-critic methods achieve better stability and sample efficiency.",
    related: ["Reinforcement Learning", "Policy Gradient", "Value Function"],
    vendors: ["OpenAI", "PyTorch"]
  },
  {
    term: "Temporal Difference Learning",
    abbr: "TD Learning",
    category: "AI/ML",
    definition: "A reinforcement learning approach that combines Monte Carlo and dynamic programming. TD learning updates value estimates based on other estimates.",
    related: ["Reinforcement Learning", "Q-Learning", "Value Function"],
    vendors: ["Various"]
  },
  {
    term: "Reward Shaping",
    category: "AI/ML",
    definition: "A technique that modifies the reward signal in reinforcement learning to guide agent learning. Well-designed reward shaping accelerates learning.",
    related: ["Reinforcement Learning", "Reward"],
    vendors: ["Various"]
  },
  {
    term: "Exploration-Exploitation Tradeoff",
    category: "AI/ML",
    definition: "A fundamental problem in reinforcement learning: deciding whether to explore new actions or exploit known good actions. Epsilon-greedy and UCB are common strategies.",
    related: ["Reinforcement Learning", "Epsilon-Greedy", "Bandit Problem"],
    vendors: ["Various"]
  },
  {
    term: "Epsilon-Greedy",
    category: "AI/ML",
    definition: "An exploration strategy that with probability epsilon chooses a random action and otherwise exploits the best known action. Epsilon-greedy balances exploration and exploitation.",
    related: ["Exploration-Exploitation Tradeoff", "Reinforcement Learning"],
    vendors: ["Various"]
  },
  {
    term: "Bandit Problem",
    category: "AI/ML",
    definition: "A reinforcement learning problem with a single state and multiple actions with unknown rewards. Bandit algorithms are foundational for contextual decision-making.",
    related: ["Reinforcement Learning", "Exploration-Exploitation Tradeoff"],
    vendors: ["Various"]
  },
  {
    term: "Reward",
    category: "AI/ML",
    definition: "A numerical signal indicating the immediate value of an action or state in reinforcement learning. Rewards guide agent learning toward desired behavior.",
    related: ["Reinforcement Learning", "Policy", "Value Function"],
    vendors: ["OpenAI Gym"]
  },

  /* ========== NEURAL ARCHITECTURE SEARCH ========== */
  {
    term: "Neural Architecture Search",
    abbr: "NAS",
    category: "AI/ML",
    definition: "An automated machine learning technique that searches for optimal neural network architectures. NAS reduces manual architecture design and discovers novel architectures.",
    related: ["Hyperparameter Tuning", "AutoML", "Architecture Design"],
    vendors: ["Google", "AutoML"]
  },
  {
    term: "AutoML",
    category: "AI/ML",
    definition: "Automated Machine Learning — a field that automates the process of selecting algorithms, hyperparameters and data preprocessing. AutoML makes machine learning accessible to non-experts.",
    related: ["Neural Architecture Search", "Hyperparameter Tuning"],
    vendors: ["Auto-sklearn", "TPOT"]
  },
  {
    term: "Bayesian Optimization",
    category: "AI/ML",
    definition: "A hyperparameter optimization technique using Bayesian inference to model the objective function. Bayesian optimization is sample-efficient and discovers good hyperparameters with few evaluations.",
    related: ["Hyperparameter Tuning", "Gaussian Process"],
    vendors: ["Optuna", "Hyperopt"]
  },
  {
    term: "Gaussian Process",
    category: "AI/ML",
    definition: "A probabilistic model that places distributions over functions, useful for regression and optimization. Gaussian processes quantify uncertainty in predictions.",
    related: ["Probabilistic Model", "Bayesian Optimization", "Regression"],
    vendors: ["GPy", "Scikit-learn"]
  },
  {
    term: "Evolutionary Algorithm",
    category: "AI/ML",
    definition: "A metaheuristic optimization technique inspired by biological evolution using selection, mutation and crossover. Evolutionary algorithms explore large search spaces without gradients.",
    related: ["Genetic Algorithm", "Optimization", "Population-Based Training"],
    vendors: ["DEAP", "PyEvolve"]
  },
  {
    term: "Genetic Algorithm",
    category: "AI/ML",
    definition: "An evolutionary algorithm that evolves solutions through natural selection and genetic operators. Genetic algorithms are effective for combinatorial optimization problems.",
    related: ["Evolutionary Algorithm", "Population-Based Training"],
    vendors: ["DEAP"]
  },
  {
    term: "Population-Based Training",
    abbr: "PBT",
    category: "AI/ML",
    definition: "A training approach inspired by population-based evolutionary methods that trains populations of neural networks. PBT enables efficient hyperparameter adaptation during training.",
    related: ["Evolutionary Algorithm", "Hyperparameter Tuning"],
    vendors: ["Ray Tune"]
  },

  /* ========== ADVANCED ARCHITECTURES ========== */
  {
    term: "MobileViT",
    category: "AI/ML",
    definition: "Mobile Vision Transformer — a lightweight vision transformer designed for mobile devices. MobileViT combines CNNs and transformers for efficient inference.",
    related: ["Vision Transformer", "MobileNet", "Efficient Architecture"],
    vendors: ["Apple"]
  },
  {
    term: "DenseNet",
    category: "AI/ML",
    definition: "Densely Connected Network — a CNN architecture where each layer receives input from all previous layers. Dense connections improve gradient flow and reduce parameters.",
    related: ["Convolutional Neural Network", "ResNet"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Inception Network",
    category: "AI/ML",
    definition: "A deep CNN architecture with parallel convolutional branches of different filter sizes. Inception modules capture multi-scale features efficiently.",
    related: ["Convolutional Neural Network", "GoogLeNet"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "GoogLeNet",
    category: "AI/ML",
    definition: "A deep CNN architecture that introduced the Inception module for efficient multi-scale feature extraction. GoogLeNet achieved state-of-the-art results on ImageNet.",
    related: ["Inception Network", "Convolutional Neural Network"],
    vendors: ["Google", "TensorFlow"]
  },
  {
    term: "SqueezeNet",
    category: "AI/ML",
    definition: "A lightweight CNN that achieves AlexNet-level accuracy with 50x fewer parameters. SqueezeNet uses Fire modules for parameter efficiency.",
    related: ["Model Compression", "MobileNet", "Efficient Architecture"],
    vendors: ["PyTorch"]
  },
  {
    term: "ShuffleNet",
    category: "AI/ML",
    definition: "An efficient CNN architecture that uses channel shuffle to reduce computation while maintaining accuracy. ShuffleNet is designed for mobile devices.",
    related: ["MobileNet", "Model Compression", "Efficient Architecture"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Neural ODE",
    category: "AI/ML",
    definition: "A neural network that models continuous dynamics using ODEs. Neural ODEs have constant memory cost and enable flexible computation.",
    related: ["Deep Learning", "Differential Equations"],
    vendors: ["PyTorch"]
  },
  {
    term: "Graph Neural Network",
    abbr: "GNN",
    category: "AI/ML",
    definition: "A neural network designed to process graph-structured data with nodes and edges. GNNs enable learning on molecules, social networks and knowledge graphs.",
    related: ["Deep Learning", "Graph Convolutional Network", "Message Passing"],
    vendors: ["PyTorch Geometric", "DGL"]
  },
  {
    term: "Graph Convolutional Network",
    abbr: "GCN",
    category: "AI/ML",
    definition: "A graph neural network that extends CNNs to graph data by aggregating node features from neighbors. GCNs are effective for semi-supervised learning on graphs.",
    related: ["Graph Neural Network", "Convolution"],
    vendors: ["PyTorch Geometric", "TensorFlow"]
  },
  {
    term: "Graph Attention Network",
    abbr: "GAT",
    category: "AI/ML",
    definition: "A graph neural network using attention mechanisms to weight node neighbors. GAT enables adaptive feature aggregation on graphs.",
    related: ["Graph Neural Network", "Attention Mechanism"],
    vendors: ["PyTorch Geometric"]
  },
  {
    term: "Message Passing",
    category: "AI/ML",
    definition: "A framework for graph neural networks where nodes update their representations by exchanging messages with neighbors. Message passing is foundational for GNNs.",
    related: ["Graph Neural Network", "Graph Convolution"],
    vendors: ["PyTorch Geometric"]
  },
  {
    term: "Knowledge Graph Embedding",
    category: "AI/ML",
    definition: "A technique that learns continuous vector representations of entities and relations in knowledge graphs. Embeddings enable knowledge graph completion and reasoning.",
    related: ["Knowledge Graph", "Embedding", "Entity Embedding"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Mixture of Experts",
    abbr: "MoE",
    category: "AI/ML",
    definition: "A neural network ensemble approach where multiple expert networks specialize on different inputs and a gating network routes inputs. MoE enables efficient scaling.",
    related: ["Ensemble Learning", "Neural Network", "Sparse Models"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Sparse Model",
    category: "AI/ML",
    definition: "A neural network where only a small fraction of parameters are active for each input. Sparse models reduce computation and enable efficient scaling.",
    related: ["Mixture of Experts", "Pruning"],
    vendors: ["Various"]
  },
  {
    term: "Capsule Network",
    category: "AI/ML",
    definition: "A neural network architecture using capsules (groups of neurons) to represent entities. Capsule networks capture pose and deformation variations.",
    related: ["Convolutional Neural Network", "Neural Network"],
    vendors: ["PyTorch", "TensorFlow"]
  },

  /* ========== ATTENTION & TRANSFORMER VARIANTS ========== */
  {
    term: "Linear Attention",
    category: "AI/ML",
    definition: "An attention variant with linear complexity replacing the quadratic softmax attention. Linear attention enables efficient long sequence processing.",
    related: ["Attention Mechanism", "Transformer", "Computational Efficiency"],
    vendors: ["PyTorch"]
  },
  {
    term: "Flash Attention",
    category: "AI/ML",
    definition: "An optimized attention implementation that reduces memory access and improves GPU utilization. Flash Attention enables faster and more memory-efficient transformers.",
    related: ["Attention Mechanism", "Computational Efficiency"],
    vendors: ["Stanford"]
  },
  {
    term: "Cross-Attention",
    category: "AI/ML",
    definition: "An attention mechanism where queries come from one sequence and keys/values from another. Cross-attention enables multimodal interaction in models.",
    related: ["Attention Mechanism", "Transformer", "Multimodal Learning"],
    vendors: ["PyTorch"]
  },
  {
    term: "Rotary Embeddings",
    abbr: "RoPE",
    category: "AI/ML",
    definition: "A positional encoding method using rotation matrices for transformers. Rotary embeddings improve extrapolation and generalization.",
    related: ["Positional Encoding", "Transformer"],
    vendors: ["PyTorch"]
  },
  {
    term: "Alibi Attention",
    category: "AI/ML",
    definition: "A positional encoding approach using relative position biases in attention. ALiBi improves length extrapolation without explicit position embeddings.",
    related: ["Positional Encoding", "Attention Mechanism"],
    vendors: ["Meta"]
  },
  {
    term: "Sparse Attention",
    category: "AI/ML",
    definition: "An attention pattern that connects only a sparse subset of positions rather than all positions. Sparse attention reduces computation for long sequences.",
    related: ["Attention Mechanism", "Computational Efficiency"],
    vendors: ["OpenAI", "PyTorch"]
  },
  {
    term: "Local Attention",
    category: "AI/ML",
    definition: "An attention pattern where each position only attends to nearby positions. Local attention is efficient for long sequences.",
    related: ["Attention Mechanism", "Sparse Attention"],
    vendors: ["PyTorch"]
  },
  {
    term: "Longformer",
    category: "AI/ML",
    definition: "A transformer variant with local windowed attention and task-specific attention patterns. Longformer efficiently handles long documents.",
    related: ["Transformer", "Local Attention", "Language Model"],
    vendors: ["Hugging Face"]
  },
  {
    term: "Big Bird",
    category: "AI/ML",
    definition: "A sparse attention transformer that enables efficient processing of long sequences. Big Bird combines block-local, random and global attention patterns.",
    related: ["Transformer", "Sparse Attention", "Language Model"],
    vendors: ["Google"]
  },
  {
    term: "Performer",
    category: "AI/ML",
    definition: "A transformer variant using kernel methods to approximate attention with linear complexity. Performers enable efficient attention for long sequences.",
    related: ["Transformer", "Attention Mechanism", "Kernel Methods"],
    vendors: ["Google", "PyTorch"]
  },
  {
    term: "Linformer",
    category: "AI/ML",
    definition: "A linear complexity transformer using low-rank approximations of attention. Linformer scales quadratically in sequence length while maintaining performance.",
    related: ["Transformer", "Linear Attention"],
    vendors: ["Facebook"]
  },
  {
    term: "Efficient Transformer",
    category: "AI/ML",
    definition: "A class of transformers designed to reduce computational and memory complexity. Efficient transformers enable processing of longer sequences.",
    related: ["Transformer", "Computational Efficiency", "Linear Attention"],
    vendors: ["Various"]
  },

  /* ========== LANGUAGE MODELS & NLP TECHNIQUES ========== */
  {
    term: "Prefix Tuning",
    category: "AI/ML",
    definition: "A parameter-efficient fine-tuning method that prepends learnable prefix tokens to input sequences. Prefix tuning avoids catastrophic forgetting.",
    related: ["Fine-Tuning", "Transfer Learning", "Prompt-Based Learning"],
    vendors: ["Stanford", "Hugging Face"]
  },
  {
    term: "Adapter Modules",
    category: "AI/ML",
    definition: "Small trainable modules inserted into pre-trained models for task-specific adaptation. Adapters enable efficient multi-task learning.",
    related: ["Fine-Tuning", "Transfer Learning", "Parameter Efficiency"],
    vendors: ["Hugging Face"]
  },
  {
    term: "LoRA",
    category: "AI/ML",
    definition: "Low-Rank Adaptation — a parameter-efficient fine-tuning method using low-rank weight updates. LoRA significantly reduces trainable parameters.",
    related: ["Fine-Tuning", "Parameter Efficiency", "Transfer Learning"],
    vendors: ["Microsoft", "Hugging Face"]
  },
  {
    term: "QLoRA",
    category: "AI/ML",
    definition: "Quantized LoRA — combines quantization with LoRA for extremely efficient fine-tuning on consumer GPUs. QLoRA enables 7B parameter models on a single GPU.",
    related: ["LoRA", "Quantization", "Fine-Tuning"],
    vendors: ["UWashington", "Hugging Face"]
  },
  {
    term: "Fine-Tuning",
    category: "AI/ML",
    definition: "Adapting a pre-trained model to a downstream task by training on task-specific data. Fine-tuning is sample-efficient and leverages pre-trained knowledge.",
    related: ["Transfer Learning", "Pre-trained Model", "Supervised Learning"],
    vendors: ["Hugging Face", "TensorFlow"]
  },
  {
    term: "Pre-trained Model",
    category: "AI/ML",
    definition: "A model trained on large-scale data that serves as a starting point for downstream tasks. Pre-trained models enable transfer learning and reduce data requirements.",
    related: ["Transfer Learning", "Fine-Tuning", "Foundation Model"],
    vendors: ["Hugging Face", "Google"]
  },
  {
    term: "Foundation Model",
    category: "AI/ML",
    definition: "A large-scale model trained on broad data that can be adapted to many downstream tasks. Foundation models exhibit emergent capabilities across domains.",
    related: ["Large Language Model", "Pre-trained Model", "Transfer Learning"],
    vendors: ["OpenAI", "Google", "Meta"]
  },
  {
    term: "Prompt Template",
    category: "AI/ML",
    definition: "A structured format for prompts with placeholders for variable inputs. Prompt templates enable consistent and reusable prompting.",
    related: ["Prompt Engineering", "Few-Shot Learning"],
    vendors: ["Hugging Face", "LangChain"]
  },
  {
    term: "Instruction Tuning",
    category: "AI/ML",
    definition: "A fine-tuning approach that trains models to follow natural language instructions. Instruction-tuned models exhibit strong generalization to new tasks.",
    related: ["Fine-Tuning", "Language Model", "Supervised Learning"],
    vendors: ["Google", "OpenAI"]
  },
  {
    term: "Reinforcement Learning from Human Feedback",
    abbr: "RLHF",
    category: "AI/ML",
    definition: "A technique combining reinforcement learning with human preferences to align language models with human values. RLHF improves model safety and quality.",
    related: ["Reinforcement Learning", "Language Model", "Human Feedback"],
    vendors: ["OpenAI", "Anthropic"]
  },
  {
    term: "Constitutional AI",
    abbr: "CAI",
    category: "AI/ML",
    definition: "An approach that uses a set of principles (constitution) to guide model behavior during training. Constitutional AI reduces need for human feedback.",
    related: ["RLHF", "Language Model", "Alignment"],
    vendors: ["Anthropic"]
  },
  {
    term: "Model Alignment",
    category: "AI/ML",
    definition: "The process of ensuring AI models behave in accordance with human values and intentions. Alignment is critical for safe and beneficial AI.",
    related: ["RLHF", "Constitutional AI", "Safety"],
    vendors: ["OpenAI", "Anthropic"]
  },
  {
    term: "Memorization",
    category: "AI/ML",
    definition: "A phenomenon where models learn training data exactly rather than generalizing. Memorization is problematic for privacy and generalization.",
    related: ["Overfitting", "Generalization", "Differential Privacy"],
    vendors: ["Various"]
  },
  {
    term: "Hallucination",
    category: "AI/ML",
    definition: "A phenomenon where language models generate plausible but false information. Hallucination is a major challenge for reliable language models.",
    related: ["Language Model", "Factuality", "Grounding"],
    vendors: ["Various"]
  },
  {
    term: "Retrieval Augmented Generation",
    abbr: "RAG",
    category: "AI/ML",
    definition: "A technique that augments language models with retrieved relevant documents. RAG reduces hallucinations and improves factuality.",
    related: ["Language Model", "Information Retrieval", "Question Answering"],
    vendors: ["Meta", "Hugging Face"]
  },
  {
    term: "Semantic Scholar",
    category: "AI/ML",
    definition: "An AI-powered research tool for discovering scientific papers. Semantic Scholar uses embeddings for semantic search.",
    related: ["Information Retrieval", "Semantic Search"],
    vendors: ["Allen Institute"]
  },
  {
    term: "Grounding",
    category: "AI/ML",
    definition: "Connecting language model outputs to external knowledge and reality. Grounding improves factuality and reliability of language models.",
    related: ["Retrieval Augmented Generation", "Knowledge Integration"],
    vendors: ["Various"]
  },
  {
    term: "Fact Verification",
    category: "AI/ML",
    definition: "A task that verifies whether factual claims are true. Fact verification uses evidence retrieval and reasoning.",
    related: ["Natural Language Processing", "Information Retrieval"],
    vendors: ["Various"]
  },
  {
    term: "Paraphrase Generation",
    category: "AI/ML",
    definition: "An NLP task that generates alternative expressions of the same meaning. Paraphrasing is useful for data augmentation and diversity.",
    related: ["Natural Language Processing", "Text Generation"],
    vendors: ["Hugging Face"]
  },
  {
    term: "Controlled Text Generation",
    category: "AI/ML",
    definition: "A technique for generating text with specific attributes or properties. Controlled generation enables customization of model outputs.",
    related: ["Text Generation", "Language Model"],
    vendors: ["Hugging Face"]
  },

  /* ========== PROMPT-BASED LEARNING ========== */
  {
    term: "Prompt-Based Learning",
    category: "AI/ML",
    definition: "A learning paradigm where tasks are reformulated as prompting language models. Prompt-based learning enables few-shot adaptation.",
    related: ["Prompt Engineering", "Few-Shot Learning", "Language Model"],
    vendors: ["OpenAI", "Hugging Face"]
  },
  {
    term: "Cloze Task",
    category: "AI/ML",
    definition: "A task where models fill in masked tokens in a sequence. Cloze tasks are used for pre-training language models.",
    related: ["Language Model", "Masked Language Modeling"],
    vendors: ["Hugging Face"]
  },
  {
    term: "Masked Language Modeling",
    abbr: "MLM",
    category: "AI/ML",
    definition: "A pre-training objective where models predict masked tokens based on context. MLM is the foundation for BERT and other models.",
    related: ["Pre-training", "Language Model", "BERT"],
    vendors: ["Google", "Hugging Face"]
  },
  {
    term: "Next Sentence Prediction",
    abbr: "NSP",
    category: "AI/ML",
    definition: "A pre-training objective where models predict whether sentences are consecutive. NSP helps models understand discourse structure.",
    related: ["Pre-training", "Language Model", "BERT"],
    vendors: ["Google"]
  },
  {
    term: "Causal Language Modeling",
    category: "AI/ML",
    definition: "A pre-training objective where models predict the next token given previous context. Causal modeling is foundational for autoregressive language models.",
    related: ["Language Model", "Autoregressive Model", "GPT"],
    vendors: ["OpenAI", "Hugging Face"]
  },
  {
    term: "Autoregressive Model",
    category: "AI/ML",
    definition: "A generative model that predicts each token conditioned on previously generated tokens. Autoregressive models are used for text generation.",
    related: ["Language Model", "Sequence Generation", "GPT"],
    vendors: ["OpenAI"]
  },
  {
    term: "Denoising Autoencoder",
    category: "AI/ML",
    definition: "An autoencoder trained to reconstruct inputs from corrupted versions. Denoising autoencoders learn robust representations.",
    related: ["Autoencoder", "Self-Supervised Learning"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Variational Inference",
    category: "AI/ML",
    definition: "A method for approximate Bayesian inference using variational distributions. Variational inference enables efficient learning of complex models.",
    related: ["Bayesian Inference", "Variational Autoencoder"],
    vendors: ["PyMC", "Stan"]
  },

  /* ========== MULTIMODAL & VISION-LANGUAGE ========== */
  {
    term: "DALL-E",
    category: "AI/ML",
    definition: "A text-to-image generation model from OpenAI using contrastive learning. DALL-E generates diverse and creative images from text descriptions.",
    related: ["Text-to-Image Generation", "Vision-Language Model", "Diffusion Model"],
    vendors: ["OpenAI"]
  },
  {
    term: "Text-to-Image Generation",
    category: "AI/ML",
    definition: "A task that generates images from text descriptions using deep learning. Text-to-image models combine vision and language understanding.",
    related: ["Image Generation", "Vision-Language Model"],
    vendors: ["Stability AI", "OpenAI"]
  },
  {
    term: "Image-to-Text Generation",
    category: "AI/ML",
    definition: "A task that generates text descriptions from images. Image-to-text includes image captioning and visual question answering.",
    related: ["Image Captioning", "Vision-Language Model"],
    vendors: ["Hugging Face"]
  },
  {
    term: "Cross-Lingual Model",
    category: "AI/ML",
    definition: "A language model trained on multiple languages enabling cross-lingual transfer. Cross-lingual models support multilingual applications.",
    related: ["Language Model", "Transfer Learning", "Multilingual NLP"],
    vendors: ["Meta", "Google"]
  },
  {
    term: "Code Model",
    category: "AI/ML",
    definition: "A language model trained on source code for code generation and understanding. Code models enable AI-assisted programming.",
    related: ["Language Model", "Code Generation"],
    vendors: ["OpenAI", "GitHub"]
  },
  {
    term: "Code Generation",
    category: "AI/ML",
    definition: "Automatically generating source code from specifications or prompts. Code generation models assist developers in writing code.",
    related: ["Code Model", "Program Synthesis"],
    vendors: ["GitHub Copilot", "OpenAI"]
  },
  {
    term: "Program Synthesis",
    category: "AI/ML",
    definition: "Automatically generating programs from specifications or examples. Program synthesis uses neural and symbolic methods.",
    related: ["Code Generation", "Language Model"],
    vendors: ["Microsoft", "Google"]
  },

  /* ========== BIOLOGICAL & NEUROSCIENCE-INSPIRED AI ========== */
  {
    term: "Spiking Neural Network",
    abbr: "SNN",
    category: "AI/ML",
    definition: "A neural network model mimicking biological neurons that communicate via spikes. Spiking networks are energy-efficient and suitable for neuromorphic hardware.",
    related: ["Neural Network", "Biologically-Inspired AI", "Neuromorphic Computing"],
    vendors: ["Brian2", "Norse"]
  },
  {
    term: "Neuromorphic Computing",
    category: "AI/ML",
    definition: "Computing architecture inspired by biological neural systems. Neuromorphic systems are energy-efficient and suitable for edge AI.",
    related: ["Spiking Neural Network", "Brain-Inspired AI"],
    vendors: ["Intel Loihi", "IBM TrueNorth"]
  },
  {
    term: "Biologically-Inspired AI",
    category: "AI/ML",
    definition: "AI systems designed to mimic aspects of biological intelligence. Bio-inspired approaches include genetic algorithms and neural networks.",
    related: ["Evolutionary Algorithm", "Spiking Neural Network"],
    vendors: ["Various"]
  },
  {
    term: "Hebbian Learning",
    category: "AI/ML",
    definition: "A learning rule where synaptic strength increases when neurons fire together. Hebbian learning is foundational to neuroscience-inspired models.",
    related: ["Neural Network", "Synaptic Plasticity"],
    vendors: ["Various"]
  },
  {
    term: "Attention Deficit",
    category: "AI/ML",
    definition: "A technique where attention mechanisms selectively focus on important information. Used to improve model efficiency and interpretability.",
    related: ["Attention Mechanism", "Interpretability"],
    vendors: ["Various"]
  },

  /* ========== EDGE AI & MOBILE ML ========== */
  {
    term: "Edge AI",
    category: "AI/ML",
    definition: "Running machine learning models on edge devices (phones, IoT) rather than cloud servers. Edge AI enables offline operation and privacy.",
    related: ["Model Compression", "Inference", "Mobile ML"],
    vendors: ["TensorFlow Lite", "PyTorch Mobile"]
  },
  {
    term: "Mobile ML",
    category: "AI/ML",
    definition: "Machine learning optimization for mobile platforms with constraints on compute and memory. Mobile ML requires model compression and efficient inference.",
    related: ["Edge AI", "Model Compression"],
    vendors: ["TensorFlow Lite", "Core ML"]
  },
  {
    term: "TensorFlow Lite",
    category: "AI/ML",
    definition: "A lightweight machine learning framework for mobile and embedded devices. TensorFlow Lite enables efficient inference on resource-constrained devices.",
    related: ["Edge AI", "Mobile ML", "TensorFlow"],
    vendors: ["Google", "TensorFlow"]
  },
  {
    term: "ONNX",
    category: "AI/ML",
    definition: "Open Neural Network Exchange — a standard format for representing neural networks. ONNX enables model interoperability across frameworks.",
    related: ["Model Format", "Inference", "Deployment"],
    vendors: ["Microsoft", "Facebook", "Amazon"]
  },
  {
    term: "CoreML",
    category: "AI/ML",
    definition: "Apple's machine learning framework for iOS, macOS and other Apple platforms. CoreML enables on-device machine learning on Apple devices.",
    related: ["Mobile ML", "Edge AI"],
    vendors: ["Apple"]
  },
  {
    term: "MediaPipe",
    category: "AI/ML",
    definition: "A cross-platform framework for building perception pipelines on mobile and desktop. MediaPipe provides pre-built models for hand, face and pose detection.",
    related: ["Edge AI", "Computer Vision", "Mobile ML"],
    vendors: ["Google"]
  },
  {
    term: "TensorFlow.js",
    category: "AI/ML",
    definition: "A JavaScript library for machine learning in the browser and Node.js. TensorFlow.js enables client-side machine learning.",
    related: ["Machine Learning Framework", "Web AI"],
    vendors: ["Google", "TensorFlow"]
  },
  {
    term: "WebGL",
    category: "AI/ML",
    definition: "A JavaScript API for GPU-accelerated graphics that enables efficient neural network inference in browsers. WebGL powers TensorFlow.js.",
    related: ["GPU Acceleration", "Web AI"],
    vendors: ["Khronos Group"]
  },
  {
    term: "Federated Inference",
    category: "AI/ML",
    definition: "Making predictions using distributed models trained via federated learning. Federated inference preserves privacy.",
    related: ["Federated Learning", "Privacy-Preserving ML"],
    vendors: ["Google"]
  },

  /* ========== PRIVACY-PRESERVING ML ========== */
  {
    term: "Differential Privacy",
    abbr: "DP",
    category: "AI/ML",
    definition: "A mathematical framework for quantifying and limiting privacy loss in data analysis. Differential privacy enables privacy-preserving machine learning.",
    related: ["Privacy", "Federated Learning"],
    vendors: ["TensorFlow Privacy"]
  },
  {
    term: "Homomorphic Encryption",
    category: "AI/ML",
    definition: "An encryption scheme enabling computation on encrypted data. Homomorphic encryption enables privacy-preserving inference.",
    related: ["Privacy", "Encryption", "Cryptography"],
    vendors: ["Various"]
  },
  {
    term: "Secure Multiparty Computation",
    abbr: "MPC",
    category: "AI/ML",
    definition: "A cryptographic protocol enabling multiple parties to compute on private data. MPC preserves privacy in distributed machine learning.",
    related: ["Privacy", "Cryptography", "Federated Learning"],
    vendors: ["Various"]
  },
  {
    term: "Privacy Budget",
    category: "AI/ML",
    definition: "In differential privacy, the total allowable privacy loss. Privacy budget controls the tradeoff between privacy and utility.",
    related: ["Differential Privacy", "Privacy"],
    vendors: ["TensorFlow Privacy"]
  },
  {
    term: "Data Poisoning",
    category: "AI/ML",
    definition: "An adversarial attack that corrupts training data to degrade model performance. Data poisoning is a threat to machine learning systems.",
    related: ["Adversarial Attack", "Robustness"],
    vendors: ["Various"]
  },
  {
    term: "Membership Inference",
    category: "AI/ML",
    definition: "An attack that determines if a sample was in a model's training data. Membership inference is a privacy threat.",
    related: ["Privacy", "Adversarial Attack"],
    vendors: ["Various"]
  },
  {
    term: "Model Inversion",
    category: "AI/ML",
    definition: "An attack that reconstructs training data from model outputs. Model inversion threatens privacy of training data.",
    related: ["Privacy", "Adversarial Attack"],
    vendors: ["Various"]
  },

  /* ========== ADVERSARIAL & ROBUSTNESS ========== */
  {
    term: "Adversarial Attack",
    category: "AI/ML",
    definition: "An attack that causes a model to make incorrect predictions through carefully crafted inputs. Adversarial attacks reveal model vulnerabilities.",
    related: ["Adversarial Robustness", "Security", "Perturbation"],
    vendors: ["Cleverhans", "Foolbox"]
  },
  {
    term: "Adversarial Example",
    category: "AI/ML",
    definition: "An input designed to fool a machine learning model through small perturbations. Adversarial examples are imperceptible to humans.",
    related: ["Adversarial Attack", "Perturbation"],
    vendors: ["Various"]
  },
  {
    term: "Adversarial Training",
    category: "AI/ML",
    definition: "A training method that includes adversarial examples to improve robustness. Adversarial training makes models resistant to attacks.",
    related: ["Adversarial Robustness", "Robustness"],
    vendors: ["Cleverhans"]
  },
  {
    term: "Adversarial Robustness",
    category: "AI/ML",
    definition: "The resistance of machine learning models to adversarial attacks. Adversarial robustness is critical for secure AI systems.",
    related: ["Adversarial Attack", "Adversarial Training"],
    vendors: ["Various"]
  },
  {
    term: "Perturbation",
    category: "AI/ML",
    definition: "Small changes to input data used in adversarial attacks or robustness analysis. Perturbations measure model sensitivity.",
    related: ["Adversarial Attack", "Gradient"],
    vendors: ["Various"]
  },
  {
    term: "FGSM Attack",
    category: "AI/ML",
    definition: "Fast Gradient Sign Method — a simple adversarial attack using gradient direction. FGSM is efficient but less effective than stronger attacks.",
    related: ["Adversarial Attack", "Gradient-Based Attack"],
    vendors: ["Cleverhans"]
  },
  {
    term: "Certified Robustness",
    category: "AI/ML",
    definition: "Provable guarantees that models are robust within a certain perturbation radius. Certified robustness enables safety-critical applications.",
    related: ["Adversarial Robustness", "Verification"],
    vendors: ["Various"]
  },

  /* ========== DOMAIN ADAPTATION & GENERALIZATION ========== */
  {
    term: "Domain Adaptation",
    category: "AI/ML",
    definition: "A learning approach adapting models trained on source domains to target domains. Domain adaptation handles distribution shift.",
    related: ["Transfer Learning", "Distribution Shift", "Domain Gap"],
    vendors: ["Various"]
  },
  {
    term: "Domain Gap",
    category: "AI/ML",
    definition: "The difference in distributions between source and target domains. Large domain gaps degrade model performance.",
    related: ["Domain Adaptation", "Distribution Shift"],
    vendors: ["Various"]
  },
  {
    term: "Source-Free Domain Adaptation",
    category: "AI/ML",
    definition: "Domain adaptation using only target data without access to source data. Source-free adaptation is practical for privacy and efficiency.",
    related: ["Domain Adaptation", "Transfer Learning"],
    vendors: ["Various"]
  },
  {
    term: "Unsupervised Domain Adaptation",
    category: "AI/ML",
    definition: "Domain adaptation without labeled target data. Unsupervised adaptation is challenging and practical.",
    related: ["Domain Adaptation", "Unsupervised Learning"],
    vendors: ["Various"]
  },
  {
    term: "Zero-Shot Domain Adaptation",
    category: "AI/ML",
    definition: "Adapting to unseen target domains using semantic information without target data. Zero-shot adaptation leverages semantic knowledge.",
    related: ["Domain Adaptation", "Zero-Shot Learning"],
    vendors: ["Various"]
  },
  {
    term: "Distribution Shift",
    category: "AI/ML",
    definition: "A change in the distribution of data between training and deployment. Distribution shift causes model performance degradation.",
    related: ["Domain Adaptation", "Covariate Shift", "Label Shift"],
    vendors: ["Various"]
  },
  {
    term: "Covariate Shift",
    category: "AI/ML",
    definition: "A type of distribution shift where P(X) changes but P(Y|X) remains constant. Covariate shift is common in practice.",
    related: ["Distribution Shift", "Domain Adaptation"],
    vendors: ["Various"]
  },
  {
    term: "Label Shift",
    category: "AI/ML",
    definition: "A type of distribution shift where P(Y) changes but P(X|Y) remains constant. Label shift occurs in imbalanced datasets.",
    related: ["Distribution Shift", "Class Imbalance"],
    vendors: ["Various"]
  },
  {
    term: "Out-of-Distribution Detection",
    abbr: "OOD Detection",
    category: "AI/ML",
    definition: "Detecting when inputs are from outside the training distribution. OOD detection is crucial for safe deployment.",
    related: ["Anomaly Detection", "Distribution Shift"],
    vendors: ["Various"]
  },
  {
    term: "Novelty Detection",
    category: "AI/ML",
    definition: "Detecting novel or previously unseen patterns in data. Novelty detection is related to anomaly and outlier detection.",
    related: ["Anomaly Detection", "Out-of-Distribution Detection"],
    vendors: ["Scikit-learn"]
  },

  /* ========== CAUSALITY & INTERPRETABILITY advanced ========== */
  {
    term: "Causal Inference",
    category: "AI/ML",
    definition: "The inference of cause-and-effect relationships from data. Causal inference goes beyond correlation to establish causation.",
    related: ["Causal Model", "Potential Outcomes", "Confounding"],
    vendors: ["PyTorch", "DoWhy"]
  },
  {
    term: "Causal Model",
    category: "AI/ML",
    definition: "A probabilistic model representing causal relationships between variables. Causal models enable reasoning about interventions.",
    related: ["Causal Inference", "Graphical Model", "Directed Acyclic Graph"],
    vendors: ["DoWhy"]
  },
  {
    term: "Potential Outcomes",
    category: "AI/ML",
    definition: "A framework for causal inference treating treatment effects as random variables. Potential outcomes enable estimation of causal effects.",
    related: ["Causal Inference", "Treatment Effect"],
    vendors: ["Various"]
  },
  {
    term: "Confounding",
    category: "AI/ML",
    definition: "A situation where a variable affects both treatment and outcome, creating spurious associations. Confounding is a major challenge in causal inference.",
    related: ["Causal Inference", "Bias"],
    vendors: ["DoWhy"]
  },
  {
    term: "Backdoor Criterion",
    category: "AI/ML",
    definition: "A graphical criterion for identifying confounding variables in causal models. Backdoor criterion enables correct causal identification.",
    related: ["Causal Inference", "Confounding", "Graphical Model"],
    vendors: ["DoWhy"]
  },
  {
    term: "Frontdoor Criterion",
    category: "AI/ML",
    definition: "A graphical criterion for identifying causal effects when there are hidden confounders. Frontdoor criterion extends backdoor methods.",
    related: ["Causal Inference", "Confounding"],
    vendors: ["DoWhy"]
  },
  {
    term: "Directed Acyclic Graph",
    abbr: "DAG",
    category: "AI/ML",
    definition: "A graphical representation of causal structures using directed edges. DAGs enable visual reasoning about causality.",
    related: ["Causal Model", "Graphical Model"],
    vendors: ["Various"]
  },
  {
    term: "Graphical Model",
    category: "AI/ML",
    definition: "A probabilistic model using graphs to represent dependencies between variables. Graphical models enable efficient inference.",
    related: ["Bayesian Network", "Markov Random Field"],
    vendors: ["PyMC", "Stan"]
  },
  {
    term: "Markov Random Field",
    abbr: "MRF",
    category: "AI/ML",
    definition: "An undirected graphical model representing conditional independencies. MRFs are useful for modeling spatial and structural dependencies.",
    related: ["Graphical Model", "Probabilistic Model"],
    vendors: ["Various"]
  },
  {
    term: "Treatment Effect",
    category: "AI/ML",
    definition: "The causal impact of a treatment on an outcome. Treatment effects are central to causal inference.",
    related: ["Causal Inference", "Potential Outcomes"],
    vendors: ["DoWhy"]
  },
  {
    term: "Heterogeneous Treatment Effect",
    abbr: "HTE",
    category: "AI/ML",
    definition: "Treatment effects that vary across subgroups or individuals. HTE enables personalized interventions.",
    related: ["Treatment Effect", "Causal Forest"],
    vendors: ["Various"]
  },
  {
    term: "Causal Forest",
    category: "AI/ML",
    definition: "A random forest variant for estimating heterogeneous treatment effects. Causal forests enable personalized prediction.",
    related: ["Random Forest", "Heterogeneous Treatment Effect"],
    vendors: ["Athey & Wager"]
  },

  /* ========== MEDICAL AI ========== */
  {
    term: "Medical Image Analysis",
    category: "AI/ML",
    definition: "Application of computer vision to medical images for diagnosis and treatment. Medical imaging combines deep learning with domain knowledge.",
    related: ["Computer Vision", "Semantic Segmentation", "Disease Detection"],
    vendors: ["Various"]
  },
  {
    term: "Disease Detection",
    category: "AI/ML",
    definition: "Using machine learning to identify diseases from medical data. Disease detection improves diagnosis speed and accuracy.",
    related: ["Medical Image Analysis", "Classification"],
    vendors: ["Various"]
  },
  {
    term: "Patient Stratification",
    category: "AI/ML",
    definition: "Dividing patients into subgroups based on characteristics for personalized treatment. Stratification enables targeted interventions.",
    related: ["Clustering", "Precision Medicine"],
    vendors: ["Various"]
  },
  {
    term: "Precision Medicine",
    category: "AI/ML",
    definition: "Tailoring medical treatment to individual characteristics. Precision medicine uses machine learning for personalization.",
    related: ["Patient Stratification", "Personalization"],
    vendors: ["Various"]
  },
  {
    term: "Drug Discovery",
    category: "AI/ML",
    definition: "Using machine learning to accelerate identification of drug candidates. AI speeds up and reduces costs of drug discovery.",
    related: ["Molecular Modeling", "Graph Neural Network"],
    vendors: ["DeepMind", "Various"]
  },
  {
    term: "Protein Structure Prediction",
    category: "AI/ML",
    definition: "Predicting 3D protein structures from amino acid sequences. AlphaFold revolutionized structure prediction.",
    related: ["Sequence Modeling", "Deep Learning"],
    vendors: ["DeepMind"]
  },
  {
    term: "AlphaFold",
    category: "AI/ML",
    definition: "An AI system from DeepMind that predicts protein structures with unprecedented accuracy. AlphaFold was a major breakthrough in biology.",
    related: ["Protein Structure Prediction", "Deep Learning"],
    vendors: ["DeepMind"]
  },
  {
    term: "Genomics",
    category: "AI/ML",
    definition: "Application of machine learning to genome analysis and genetic data. Genomics enables personalized medicine and disease understanding.",
    related: ["Sequence Modeling", "Classification"],
    vendors: ["Various"]
  },
  {
    term: "Electronic Health Records",
    abbr: "EHR",
    category: "AI/ML",
    definition: "Digital records of patient health information used for prediction and analysis. EHR data enables learning of patient outcomes.",
    related: ["Healthcare AI", "Sequential Data"],
    vendors: ["Various"]
  },

  /* ========== FINANCIAL AI ========== */
  {
    term: "Algorithmic Trading",
    category: "AI/ML",
    definition: "Using machine learning models to make automated trading decisions. Algorithmic trading exploits patterns in market data.",
    related: ["Time Series Prediction", "Reinforcement Learning"],
    vendors: ["Various"]
  },
  {
    term: "Credit Scoring",
    category: "AI/ML",
    definition: "Predicting creditworthiness using machine learning on financial data. Credit scoring determines loan approval and terms.",
    related: ["Classification", "Risk Assessment"],
    vendors: ["Various"]
  },
  {
    term: "Fraud Detection",
    category: "AI/ML",
    definition: "Using machine learning to identify fraudulent transactions or activities. Fraud detection protects financial institutions.",
    related: ["Anomaly Detection", "Classification"],
    vendors: ["Various"]
  },
  {
    term: "Risk Assessment",
    category: "AI/ML",
    definition: "Quantifying and predicting financial risk using machine learning. Risk assessment informs investment and lending decisions.",
    related: ["Prediction", "Classification"],
    vendors: ["Various"]
  },
  {
    term: "Portfolio Optimization",
    category: "AI/ML",
    definition: "Using optimization algorithms to allocate assets in investment portfolios. Portfolio optimization balances risk and return.",
    related: ["Optimization", "Risk Management"],
    vendors: ["Various"]
  },

  /* ========== REINFORCEMENT LEARNING ADVANCED ========== */
  {
    term: "Model-Based RL",
    category: "AI/ML",
    definition: "Reinforcement learning that learns an explicit model of the environment dynamics. Model-based RL enables planning.",
    related: ["Reinforcement Learning", "Model Learning"],
    vendors: ["Various"]
  },
  {
    term: "Model-Free RL",
    category: "AI/ML",
    definition: "Reinforcement learning that directly learns policies without modeling environment dynamics. Model-free RL is simpler but less sample-efficient.",
    related: ["Reinforcement Learning", "Policy Gradient"],
    vendors: ["Various"]
  },
  {
    term: "On-Policy Learning",
    category: "AI/ML",
    definition: "Reinforcement learning where the agent learns from data generated by the current policy. On-policy learning is safer but less sample-efficient.",
    related: ["Reinforcement Learning", "Policy Gradient"],
    vendors: ["Various"]
  },
  {
    term: "Off-Policy Learning",
    category: "AI/ML",
    definition: "Reinforcement learning where the agent learns from data generated by other policies. Off-policy learning is sample-efficient.",
    related: ["Reinforcement Learning", "Q-Learning"],
    vendors: ["Various"]
  },
  {
    term: "Experience Replay",
    category: "AI/ML",
    definition: "A technique storing and replaying past experiences to decorrelate samples. Experience replay stabilizes learning in deep RL.",
    related: ["Reinforcement Learning", "Deep Q-Network"],
    vendors: ["Various"]
  },
  {
    term: "Deep Q-Network",
    abbr: "DQN",
    category: "AI/ML",
    definition: "A deep reinforcement learning algorithm using Q-learning with neural networks. DQN achieved superhuman performance on Atari games.",
    related: ["Q-Learning", "Deep Reinforcement Learning"],
    vendors: ["DeepMind"]
  },
  {
    term: "Deep Reinforcement Learning",
    abbr: "Deep RL",
    category: "AI/ML",
    definition: "Reinforcement learning using deep neural networks. Deep RL enables learning from high-dimensional observations like images.",
    related: ["Reinforcement Learning", "Deep Learning"],
    vendors: ["OpenAI", "DeepMind"]
  },
  {
    term: "AlphaGo",
    category: "AI/ML",
    definition: "An AI system from DeepMind that defeated human champions in the game Go. AlphaGo demonstrated the power of deep RL.",
    related: ["Deep Reinforcement Learning", "Monte Carlo Tree Search"],
    vendors: ["DeepMind"]
  },
  {
    term: "Monte Carlo Tree Search",
    abbr: "MCTS",
    category: "AI/ML",
    definition: "A tree search algorithm using random simulations to estimate move values. MCTS is effective in games and planning.",
    related: ["Planning", "Search Algorithm"],
    vendors: ["Various"]
  },
  {
    term: "Imitation Learning",
    category: "AI/ML",
    definition: "Learning to mimic expert behavior from demonstrations. Imitation learning bootstraps learning from human guidance.",
    related: ["Reinforcement Learning", "Supervised Learning"],
    vendors: ["Various"]
  },
  {
    term: "Inverse Reinforcement Learning",
    abbr: "IRL",
    category: "AI/ML",
    definition: "Inferring the reward function from expert demonstrations. IRL enables learning objectives from human behavior.",
    related: ["Reinforcement Learning", "Imitation Learning"],
    vendors: ["Various"]
  },
  {
    term: "Multi-Agent Reinforcement Learning",
    abbr: "MARL",
    category: "AI/ML",
    definition: "Reinforcement learning with multiple interacting agents. MARL addresses coordination and competition.",
    related: ["Reinforcement Learning", "Game Theory"],
    vendors: ["OpenAI", "RLlib"]
  },
  {
    term: "Curiosity-Driven Learning",
    category: "AI/ML",
    definition: "A reinforcement learning approach where agents explore to maximize intrinsic curiosity reward. Curiosity drives exploration in sparse reward environments.",
    related: ["Reinforcement Learning", "Exploration"],
    vendors: ["OpenAI"]
  },
  {
    term: "Intrinsic Motivation",
    category: "AI/ML",
    definition: "In RL, motivation driven by internal goals rather than external rewards. Intrinsic motivation enables exploration.",
    related: ["Curiosity-Driven Learning", "Reinforcement Learning"],
    vendors: ["Various"]
  },

  /* ========== ADDITIONAL SPECIALIZED TOPICS ========== */
  {
    term: "Attention Visualization",
    category: "AI/ML",
    definition: "Visualizing which parts of input the attention mechanism focuses on. Attention visualization improves model interpretability.",
    related: ["Attention Mechanism", "Interpretability", "Visualization"],
    vendors: ["BertViz"]
  },
  {
    term: "Saliency Map",
    category: "AI/ML",
    definition: "A visualization showing which input features most influence model predictions. Saliency maps aid model interpretation.",
    related: ["Interpretability", "Gradient", "Visualization"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Gradient-Based Attribution",
    category: "AI/ML",
    definition: "Computing feature importance using gradients of predictions with respect to inputs. Gradient-based methods are efficient and differentiable.",
    related: ["Interpretability", "Feature Importance", "SHAP"],
    vendors: ["Various"]
  },
  {
    term: "Influence Function",
    category: "AI/ML",
    definition: "A method for tracing predictions to influential training examples. Influence functions enable understanding of model decisions.",
    related: ["Interpretability", "Training Data"],
    vendors: ["Various"]
  },
  {
    term: "Concept Activation Vectors",
    abbr: "TCAV",
    category: "AI/ML",
    definition: "A method for interpreting neural networks using human-defined concepts. TCAV bridges human concepts and neural representations.",
    related: ["Interpretability", "Concept Learning"],
    vendors: ["Google"]
  },
  {
    term: "Prototype Learning",
    category: "AI/ML",
    definition: "Learning prototypical examples that explain model predictions. Prototype-based models are interpretable.",
    related: ["Interpretability", "Case-Based Reasoning"],
    vendors: ["Various"]
  },
  {
    term: "Case-Based Reasoning",
    category: "AI/ML",
    definition: "A reasoning approach that solves problems by retrieving and adapting similar past cases. Case-based reasoning is interpretable.",
    related: ["Prototype Learning", "Memory-Based Learning"],
    vendors: ["Various"]
  },
  {
    term: "Counterfactual Explanation",
    category: "AI/ML",
    definition: "Explaining model predictions by describing minimal changes needed to change the outcome. Counterfactual explanations are intuitive.",
    related: ["Interpretability", "Explainability"],
    vendors: ["Various"]
  },
  {
    term: "Example-Based Explanation",
    category: "AI/ML",
    definition: "Explaining model decisions by showing similar training examples. Example-based methods are intuitive and interpretable.",
    related: ["Interpretability", "Case-Based Reasoning"],
    vendors: ["Various"]
  },
  {
    term: "Attention Attribution",
    category: "AI/ML",
    definition: "Using attention weights to attribute predictions to input elements. Attention attribution provides interpretability.",
    related: ["Attention Mechanism", "Interpretability"],
    vendors: ["Various"]
  },
  {
    term: "Fairness Metric",
    category: "AI/ML",
    definition: "Quantifying model fairness across demographic groups. Fairness metrics guide bias mitigation.",
    related: ["Fairness", "Bias"],
    vendors: ["Fairlearn", "AI Fairness 360"]
  },
  {
    term: "Fairness",
    category: "AI/ML",
    definition: "Ensuring machine learning systems treat different groups equitably. Fairness is critical for responsible AI.",
    related: ["Bias", "Discrimination", "Ethical AI"],
    vendors: ["Fairlearn"]
  },
  {
    term: "Bias Mitigation",
    category: "AI/ML",
    definition: "Techniques for reducing bias in machine learning models. Bias mitigation improves fairness.",
    related: ["Fairness", "Bias", "Pre-Processing"],
    vendors: ["Fairlearn"]
  },
  {
    term: "Pre-Processing Bias Mitigation",
    category: "AI/ML",
    definition: "Addressing bias by modifying training data before model training. Pre-processing approaches are model-agnostic.",
    related: ["Bias Mitigation", "Data Preprocessing"],
    vendors: ["Fairlearn"]
  },
  {
    term: "In-Processing Bias Mitigation",
    category: "AI/ML",
    definition: "Addressing bias during model training through loss modifications or constraints. In-processing methods are algorithm-specific.",
    related: ["Bias Mitigation", "Fairness"],
    vendors: ["Fairlearn"]
  },
  {
    term: "Post-Processing Bias Mitigation",
    category: "AI/ML",
    definition: "Addressing bias by adjusting predictions after model inference. Post-processing is model-agnostic.",
    related: ["Bias Mitigation", "Fairness"],
    vendors: ["Fairlearn"]
  },
  {
    term: "Demographic Parity",
    category: "AI/ML",
    definition: "A fairness criterion requiring equal selection rates across demographic groups. Demographic parity is a fairness metric.",
    related: ["Fairness", "Equality"],
    vendors: ["Fairlearn"]
  },
  {
    term: "Equalized Odds",
    category: "AI/ML",
    definition: "A fairness criterion requiring equal true positive and false positive rates across groups. Equalized odds balance error across groups.",
    related: ["Fairness", "Equality of Opportunity"],
    vendors: ["Fairlearn"]
  },
  {
    term: "Calibration",
    category: "AI/ML",
    definition: "Ensuring predicted probabilities match actual frequencies. Calibrated models provide reliable confidence estimates.",
    related: ["Probability Estimation", "Model Evaluation"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Uncertainty Quantification",
    category: "AI/ML",
    definition: "Quantifying confidence or uncertainty in model predictions. Uncertainty estimates are crucial for safe deployment.",
    related: ["Calibration", "Bayesian Deep Learning", "Confidence"],
    vendors: ["PyTorch", "Pyro"]
  },
  {
    term: "Bayesian Deep Learning",
    category: "AI/ML",
    definition: "Combining deep learning with Bayesian inference for uncertainty quantification. Bayesian deep learning enables principled uncertainty.",
    related: ["Deep Learning", "Bayesian Inference", "Uncertainty Quantification"],
    vendors: ["Pyro", "Edward"]
  },
  {
    term: "Monte Carlo Dropout",
    category: "AI/ML",
    definition: "Using dropout at inference time to estimate uncertainty through ensemble predictions. Monte Carlo dropout is a practical uncertainty method.",
    related: ["Dropout", "Uncertainty Quantification", "Ensemble Learning"],
    vendors: ["PyTorch"]
  },
  {
    term: "Epistemic Uncertainty",
    category: "AI/ML",
    definition: "Uncertainty due to lack of knowledge, reducible with more data. Epistemic uncertainty reflects model ignorance.",
    related: ["Uncertainty Quantification", "Aleatoric Uncertainty"],
    vendors: ["Various"]
  },
  {
    term: "Aleatoric Uncertainty",
    category: "AI/ML",
    definition: "Irreducible uncertainty due to inherent randomness in data. Aleatoric uncertainty cannot be reduced with more data.",
    related: ["Uncertainty Quantification", "Epistemic Uncertainty"],
    vendors: ["Various"]
  },

  /* ========== SPECIFIC LOSS FUNCTIONS ========== */
  {
    term: "Triplet Loss",
    category: "AI/ML",
    definition: "A loss function that minimizes distance between anchor and positive samples while maximizing distance to negatives. Triplet loss is used for metric learning and face recognition.",
    related: ["Loss Function", "Metric Learning", "Distance Metric"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Contrastive Loss",
    category: "AI/ML",
    definition: "A loss function that brings similar samples closer and pushes dissimilar samples apart. Contrastive loss is foundational for contrastive learning.",
    related: ["Loss Function", "Contrastive Learning", "Similarity"],
    vendors: ["PyTorch"]
  },
  {
    term: "Hinge Loss",
    category: "AI/ML",
    definition: "A loss function commonly used for SVM and margin-based learning. Hinge loss penalizes predictions that are not confident enough.",
    related: ["Loss Function", "Support Vector Machine"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Huber Loss",
    category: "AI/ML",
    definition: "A robust loss function that is quadratic for small errors and linear for large errors. Huber loss is less sensitive to outliers than MSE.",
    related: ["Loss Function", "Robustness", "Regression"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Focal Loss",
    category: "AI/ML",
    definition: "A loss function designed to address class imbalance by focusing on hard-to-classify examples. Focal loss reduces weight on easy examples.",
    related: ["Loss Function", "Class Imbalance", "Object Detection"],
    vendors: ["PyTorch"]
  },
  {
    term: "Kullback-Leibler Divergence",
    abbr: "KL Divergence",
    category: "AI/ML",
    definition: "A measure of how one probability distribution differs from another. KL divergence is used in information theory and probabilistic models.",
    related: ["Probability Distribution", "Information Theory"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Wasserstein Distance",
    category: "AI/ML",
    definition: "A distance metric between probability distributions measuring minimum cost of transporting probability mass. Wasserstein distance is used in GANs.",
    related: ["Distance Metric", "Probability Distribution", "GAN"],
    vendors: ["PyTorch"]
  },
  {
    term: "Earth Mover Distance",
    category: "AI/ML",
    definition: "Another name for Wasserstein distance, measuring how much mass needs to move to transform one distribution to another.",
    related: ["Wasserstein Distance", "Distance Metric"],
    vendors: ["Various"]
  },
  {
    term: "Jensen-Shannon Divergence",
    category: "AI/ML",
    definition: "A symmetric divergence measure between probability distributions based on KL divergence. Jensen-Shannon is more stable than KL.",
    related: ["KL Divergence", "Probability Distribution"],
    vendors: ["SciPy"]
  },
  {
    term: "Categorical Cross-Entropy",
    category: "AI/ML",
    definition: "A loss function for multi-class classification that measures difference between predicted and true class probabilities.",
    related: ["Cross-Entropy Loss", "Multi-Class Classification"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Binary Cross-Entropy",
    category: "AI/ML",
    definition: "A loss function for binary classification measuring difference between predicted and true binary probabilities.",
    related: ["Cross-Entropy Loss", "Binary Classification"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Sparse Categorical Cross-Entropy",
    category: "AI/ML",
    definition: "A variant of categorical cross-entropy for integer-encoded labels avoiding one-hot encoding. Sparse variant saves memory.",
    related: ["Categorical Cross-Entropy", "Cross-Entropy Loss"],
    vendors: ["TensorFlow"]
  },
  {
    term: "Negative Log-Likelihood",
    abbr: "NLL",
    category: "AI/ML",
    definition: "A loss function based on negative log probability of true labels. NLL is equivalent to cross-entropy for classification.",
    related: ["Loss Function", "Likelihood", "Classification"],
    vendors: ["PyTorch"]
  },

  /* ========== SPECIFIC ACTIVATION FUNCTIONS ========== */
  {
    term: "Swish Activation",
    category: "AI/ML",
    definition: "A smooth, non-monotonic activation function defined as x * sigmoid(x). Swish often outperforms ReLU.",
    related: ["Activation Function", "Neural Network"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "GELU Activation",
    category: "AI/ML",
    definition: "Gaussian Error Linear Unit — an activation function approximating ReLU with Gaussian CDF. GELU is used in BERT and modern transformers.",
    related: ["Activation Function", "Transformer"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Mish Activation",
    category: "AI/ML",
    definition: "A smooth activation function with self-regularization properties. Mish has shown improvements in some deep learning tasks.",
    related: ["Activation Function", "Neural Network"],
    vendors: ["PyTorch"]
  },
  {
    term: "ELU Activation",
    category: "AI/ML",
    definition: "Exponential Linear Unit — an activation allowing negative outputs for better gradient flow. ELU addresses dying ReLU problem.",
    related: ["Activation Function", "ReLU"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "SELU Activation",
    category: "AI/ML",
    definition: "Scaled ELU — an activation enabling self-normalizing neural networks. SELU maintains mean zero and unit variance.",
    related: ["ELU Activation", "Self-Normalizing Neural Networks"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Leaky ReLU",
    category: "AI/ML",
    definition: "A ReLU variant allowing small negative gradients for inactive neurons. Leaky ReLU prevents dying ReLU problem.",
    related: ["ReLU Activation", "Activation Function"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Parametric ReLU",
    abbr: "PReLU",
    category: "AI/ML",
    definition: "A ReLU variant where the slope for negative inputs is learned. PReLU adapts activation to the data.",
    related: ["ReLU Activation", "Leaky ReLU"],
    vendors: ["PyTorch"]
  },
  {
    term: "Hardtanh Activation",
    category: "AI/ML",
    definition: "A piecewise linear approximation of tanh with constant gradients in linear regions. Hardtanh is computationally efficient.",
    related: ["Activation Function", "Tanh"],
    vendors: ["PyTorch"]
  },
  {
    term: "Hard Sigmoid",
    category: "AI/ML",
    definition: "A piecewise linear approximation of sigmoid activation. Hard sigmoid is efficient for inference.",
    related: ["Sigmoid Activation", "Activation Function"],
    vendors: ["PyTorch"]
  },
  {
    term: "Log-Softmax",
    category: "AI/ML",
    definition: "A numerically stable combination of log and softmax. Log-softmax prevents numerical overflow.",
    related: ["Softmax Activation", "Numerical Stability"],
    vendors: ["PyTorch"]
  },

  /* ========== WEIGHT INITIALIZATION VARIANTS ========== */
  {
    term: "He Initialization",
    category: "AI/ML",
    definition: "A weight initialization scheme accounting for ReLU non-linearity. He initialization maintains variance across layers.",
    related: ["Weight Initialization", "ReLU Activation"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Glorot Initialization",
    category: "AI/ML",
    definition: "Another name for Xavier initialization using uniform distribution. Glorot initialization balances variance.",
    related: ["Xavier Initialization", "Weight Initialization"],
    vendors: ["TensorFlow"]
  },
  {
    term: "Kaiming Initialization",
    category: "AI/ML",
    definition: "Another name for He initialization from Kaiming He's paper. Kaiming initialization improves deep network training.",
    related: ["He Initialization", "Weight Initialization"],
    vendors: ["PyTorch"]
  },
  {
    term: "Lecun Initialization",
    category: "AI/ML",
    definition: "A weight initialization scheme for tanh and sigmoid activations. Lecun maintains gradient flow.",
    related: ["Weight Initialization", "Xavier Initialization"],
    vendors: ["PyTorch"]
  },
  {
    term: "Orthogonal Initialization",
    category: "AI/ML",
    definition: "Initializing weights as orthogonal matrices improving gradient flow. Orthogonal initialization is beneficial for RNNs.",
    related: ["Weight Initialization", "Recurrent Neural Network"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Sparse Initialization",
    category: "AI/ML",
    definition: "Weight initialization resulting in sparse connection patterns. Sparse initialization encourages sparsity.",
    related: ["Weight Initialization", "Sparse Model"],
    vendors: ["PyTorch"]
  },

  /* ========== REGULARIZATION TECHNIQUES ========== */
  {
    term: "DropConnect",
    category: "AI/ML",
    definition: "A regularization technique dropping connections between neurons during training. DropConnect is similar to dropout but drops weights.",
    related: ["Dropout", "Regularization"],
    vendors: ["Various"]
  },
  {
    term: "Stochastic Depth",
    category: "AI/ML",
    definition: "A regularization technique randomly skipping layers during training. Stochastic depth reduces training time and improves generalization.",
    related: ["Dropout", "Regularization", "Deep Learning"],
    vendors: ["PyTorch"]
  },
  {
    term: "Mixup",
    category: "AI/ML",
    definition: "A data augmentation technique mixing pairs of training examples linearly. Mixup improves generalization and robustness.",
    related: ["Data Augmentation", "Regularization"],
    vendors: ["PyTorch"]
  },
  {
    term: "Cutmix",
    category: "AI/ML",
    definition: "A data augmentation technique removing and mixing patches between images. Cutmix improves model robustness.",
    related: ["Data Augmentation", "Mixup"],
    vendors: ["PyTorch"]
  },
  {
    term: "Cutout",
    category: "AI/ML",
    definition: "A data augmentation technique removing random patches from images. Cutout acts as regularization.",
    related: ["Data Augmentation", "Regularization"],
    vendors: ["PyTorch"]
  },
  {
    term: "RandAugment",
    category: "AI/ML",
    definition: "An automated data augmentation selecting random augmentations with magnitude. RandAugment simplifies augmentation tuning.",
    related: ["Data Augmentation", "AutoML"],
    vendors: ["PyTorch"]
  },
  {
    term: "AutoAugment",
    category: "AI/ML",
    definition: "An automated data augmentation using reinforcement learning to find optimal augmentations. AutoAugment discovers effective augmentation policies.",
    related: ["Data Augmentation", "Reinforcement Learning"],
    vendors: ["Google"]
  },
  {
    term: "Ghost Batch Normalization",
    category: "AI/ML",
    definition: "A variant of batch normalization that uses smaller effective batch sizes. Ghost BN maintains diversity.",
    related: ["Batch Normalization", "Normalization"],
    vendors: ["PyTorch"]
  },
  {
    term: "Group Normalization",
    category: "AI/ML",
    definition: "A normalization technique dividing channels into groups and normalizing. Group norm works with small batch sizes.",
    related: ["Batch Normalization", "Normalization"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Instance Normalization",
    category: "AI/ML",
    definition: "A normalization technique normalizing each instance independently. Instance norm is used in style transfer.",
    related: ["Batch Normalization", "Normalization"],
    vendors: ["PyTorch"]
  },
  {
    term: "Spectral Normalization",
    category: "AI/ML",
    definition: "A normalization technique constraining spectral norm of weight matrices. Spectral normalization stabilizes GAN training.",
    related: ["Normalization", "GAN"],
    vendors: ["PyTorch"]
  },
  {
    term: "Weight Standardization",
    category: "AI/ML",
    definition: "A normalization technique standardizing weight matrices. Weight standardization improves training stability.",
    related: ["Normalization", "Regularization"],
    vendors: ["PyTorch"]
  },

  /* ========== SPECIFIC COMPUTER VISION TASKS ========== */
  {
    term: "Lane Detection",
    category: "AI/ML",
    definition: "A computer vision task identifying road lanes. Lane detection is crucial for autonomous driving.",
    related: ["Computer Vision", "Autonomous Driving", "Semantic Segmentation"],
    vendors: ["Various"]
  },
  {
    term: "Road Sign Recognition",
    category: "AI/ML",
    definition: "Classifying and detecting traffic signs from images. Road sign recognition aids autonomous systems.",
    related: ["Computer Vision", "Classification", "Object Detection"],
    vendors: ["Various"]
  },
  {
    term: "Pedestrian Detection",
    category: "AI/ML",
    definition: "Detecting and localizing pedestrians in images or videos. Pedestrian detection is essential for autonomous driving.",
    related: ["Object Detection", "Computer Vision"],
    vendors: ["Various"]
  },
  {
    term: "Vehicle Detection",
    category: "AI/ML",
    definition: "Detecting cars and vehicles in images. Vehicle detection is fundamental for autonomous systems.",
    related: ["Object Detection", "Computer Vision"],
    vendors: ["Various"]
  },
  {
    term: "Traffic Scene Understanding",
    category: "AI/ML",
    definition: "Understanding complete traffic scenes including all elements. Scene understanding is needed for autonomous driving.",
    related: ["Scene Understanding", "Computer Vision"],
    vendors: ["Various"]
  },
  {
    term: "Salient Object Detection",
    category: "AI/ML",
    definition: "Detecting visually salient regions in images. Salient detection aids attention and visual understanding.",
    related: ["Object Detection", "Segmentation"],
    vendors: ["Various"]
  },
  {
    term: "Edge Detection",
    category: "AI/ML",
    definition: "Identifying sharp changes in intensity in images (edges). Edge detection is foundational for computer vision.",
    related: ["Computer Vision", "Image Processing"],
    vendors: ["OpenCV"]
  },
  {
    term: "Contour Detection",
    category: "AI/ML",
    definition: "Finding boundaries of objects in images. Contour detection aids object recognition.",
    related: ["Edge Detection", "Computer Vision"],
    vendors: ["OpenCV"]
  },
  {
    term: "Corner Detection",
    category: "AI/ML",
    definition: "Identifying corner features in images. Corner detection is used for image matching and tracking.",
    related: ["Feature Detection", "Computer Vision"],
    vendors: ["OpenCV"]
  },
  {
    term: "Feature Matching",
    category: "AI/ML",
    definition: "Finding correspondences between features in images. Feature matching enables image alignment and 3D reconstruction.",
    related: ["Feature Detection", "Computer Vision"],
    vendors: ["OpenCV"]
  },
  {
    term: "Image Registration",
    category: "AI/ML",
    definition: "Aligning multiple images spatially. Image registration is used in medical imaging and remote sensing.",
    related: ["Computer Vision", "Image Alignment"],
    vendors: ["SimpleITK"]
  },
  {
    term: "Image Stitching",
    category: "AI/ML",
    definition: "Combining multiple images into a panorama. Image stitching requires registration and blending.",
    related: ["Image Registration", "Computer Vision"],
    vendors: ["OpenCV"]
  },
  {
    term: "Document Analysis",
    category: "AI/ML",
    definition: "Understanding document structure and content from images. Document analysis includes layout analysis and text extraction.",
    related: ["Computer Vision", "OCR"],
    vendors: ["Tesseract"]
  },
  {
    term: "Handwriting Recognition",
    category: "AI/ML",
    definition: "Recognizing handwritten text from images. Handwriting recognition requires character segmentation and classification.",
    related: ["Computer Vision", "OCR"],
    vendors: ["PyTorch"]
  },
  {
    term: "Scene Text Recognition",
    category: "AI/ML",
    definition: "Recognizing text in natural scene images. Scene text recognition is challenging due to variations.",
    related: ["OCR", "Computer Vision"],
    vendors: ["EasyOCR"]
  },
  {
    term: "Text Detection",
    category: "AI/ML",
    definition: "Localizing text regions in images. Text detection precedes recognition.",
    related: ["Scene Text Recognition", "Object Detection"],
    vendors: ["CRAFT"]
  },
  {
    term: "Document Skew Correction",
    category: "AI/ML",
    definition: "Correcting rotated or skewed document images. Skew correction improves OCR accuracy.",
    related: ["Document Analysis", "Image Processing"],
    vendors: ["OpenCV"]
  },
  {
    term: "License Plate Recognition",
    category: "AI/ML",
    definition: "Reading vehicle license plates from images. License plate recognition aids traffic monitoring.",
    related: ["OCR", "Computer Vision"],
    vendors: ["EasyOCR"]
  },

  /* ========== SPECIFIC NLP TASKS ========== */
  {
    term: "Dependency Parsing",
    category: "AI/ML",
    definition: "Identifying grammatical dependencies between words. Dependency parsing reveals sentence structure.",
    related: ["Natural Language Processing", "Parsing", "Syntax Analysis"],
    vendors: ["SpaCy", "Stanza"]
  },
  {
    term: "Constituency Parsing",
    category: "AI/ML",
    definition: "Building parse trees showing phrase structure of sentences. Constituency parsing analyzes hierarchical structure.",
    related: ["Dependency Parsing", "Natural Language Processing"],
    vendors: ["Stanford Parser"]
  },
  {
    term: "Part-of-Speech Tagging",
    abbr: "POS Tagging",
    category: "AI/ML",
    definition: "Labeling words with their grammatical roles. POS tagging is fundamental for NLP.",
    related: ["Natural Language Processing", "Sequence Labeling"],
    vendors: ["SpaCy", "NLTK"]
  },
  {
    term: "Chunking",
    category: "AI/ML",
    definition: "Grouping words into phrases (chunks). Chunking is a shallow parsing technique.",
    related: ["Natural Language Processing", "Parsing"],
    vendors: ["NLTK"]
  },
  {
    term: "Coreference Resolution",
    category: "AI/ML",
    definition: "Identifying which pronouns or noun phrases refer to same entity. Coreference resolution aids understanding.",
    related: ["Natural Language Processing", "Entity Linking"],
    vendors: ["Hugging Face"]
  },
  {
    term: "Relation Extraction",
    category: "AI/ML",
    definition: "Extracting relationships between entities from text. Relation extraction enables knowledge graph construction.",
    related: ["Information Extraction", "Natural Language Processing"],
    vendors: ["SpaCy", "OpenIE"]
  },
  {
    term: "Event Extraction",
    category: "AI/ML",
    definition: "Extracting events and their arguments from text. Event extraction enables event understanding.",
    related: ["Information Extraction", "Natural Language Processing"],
    vendors: ["Various"]
  },
  {
    term: "Aspect-Based Sentiment Analysis",
    category: "AI/ML",
    definition: "Analyzing sentiment toward specific aspects of entities. Aspect-based analysis is fine-grained.",
    related: ["Sentiment Analysis", "Natural Language Processing"],
    vendors: ["ABSA Libraries"]
  },
  {
    term: "Emotion Detection",
    category: "AI/ML",
    definition: "Detecting emotions expressed in text. Emotion detection is related to sentiment analysis.",
    related: ["Sentiment Analysis", "Natural Language Processing"],
    vendors: ["Transformers"]
  },
  {
    term: "Intent Detection",
    category: "AI/ML",
    definition: "Identifying user intent from text. Intent detection is crucial for conversational AI.",
    related: ["Natural Language Processing", "Classification"],
    vendors: ["Rasa"]
  },
  {
    term: "Slot Filling",
    category: "AI/ML",
    definition: "Extracting specific information (slots) from text. Slot filling is used in dialogue systems.",
    related: ["Information Extraction", "Natural Language Processing"],
    vendors: ["Rasa"]
  },
  {
    term: "Semantic Similarity",
    category: "AI/ML",
    definition: "Measuring semantic closeness between text sequences. Semantic similarity is measured using embeddings.",
    related: ["Natural Language Processing", "Embedding"],
    vendors: ["Sentence Transformers"]
  },
  {
    term: "Paraphrase Detection",
    category: "AI/ML",
    definition: "Determining if two sentences express the same meaning. Paraphrase detection uses semantic similarity.",
    related: ["Semantic Similarity", "Natural Language Processing"],
    vendors: ["Hugging Face"]
  },
  {
    term: "Textual Entailment",
    abbr: "RTE",
    category: "AI/ML",
    definition: "Determining if one sentence logically entails another. Textual entailment is a fundamental NLP task.",
    related: ["Natural Language Processing", "Inference"],
    vendors: ["Hugging Face"]
  },
  {
    term: "Natural Language Inference",
    abbr: "NLI",
    category: "AI/ML",
    definition: "Determining entailment relationships between premises and hypotheses. NLI tasks test logical understanding.",
    related: ["Textual Entailment", "Natural Language Processing"],
    vendors: ["Hugging Face"]
  },
  {
    term: "Dialogue State Tracking",
    category: "AI/ML",
    definition: "Tracking dialogue context and user intents across turns. State tracking enables multi-turn conversations.",
    related: ["Dialogue Systems", "Natural Language Processing"],
    vendors: ["Rasa"]
  },
  {
    term: "Response Generation",
    category: "AI/ML",
    definition: "Generating natural language responses to inputs. Response generation is core to chatbots.",
    related: ["Natural Language Processing", "Text Generation"],
    vendors: ["Hugging Face"]
  },
  {
    term: "Language Understanding",
    abbr: "LU",
    category: "AI/ML",
    definition: "Extracting meaning from language. Language understanding combines multiple NLP tasks.",
    related: ["Natural Language Processing"],
    vendors: ["Various"]
  },
  {
    term: "Language Generation",
    abbr: "LG",
    category: "AI/ML",
    definition: "Producing natural language from representations. Language generation is inverse of understanding.",
    related: ["Natural Language Processing"],
    vendors: ["Various"]
  },

  /* ========== SPECIFIC SEQUENCE MODELS ========== */
  {
    term: "Bidirectional Encoder",
    category: "AI/ML",
    definition: "An encoder reading sequences in both directions. Bidirectional encoders capture context from both sides.",
    related: ["Encoder", "BERT"],
    vendors: ["BERT", "Hugging Face"]
  },
  {
    term: "Unidirectional Decoder",
    category: "AI/ML",
    definition: "A decoder generating sequences left-to-right with causal masking. Unidirectional decoders enable autoregressive generation.",
    related: ["Decoder", "Autoregressive Model"],
    vendors: ["GPT", "Hugging Face"]
  },
  {
    term: "Encoder-Decoder Model",
    category: "AI/ML",
    definition: "A model with encoder processing input and decoder generating output. Encoder-decoder enables sequence-to-sequence tasks.",
    related: ["Encoder", "Decoder", "Sequence-to-Sequence"],
    vendors: ["T5", "BART"]
  },
  {
    term: "T5 Model",
    category: "AI/ML",
    definition: "Text-to-Text Transfer Transformer treating all NLP tasks as text-to-text. T5 unifies language understanding and generation.",
    related: ["Transformer", "Encoder-Decoder Model"],
    vendors: ["Google", "Hugging Face"]
  },
  {
    term: "BART Model",
    category: "AI/ML",
    definition: "Bidirectional Autoregressive Transformers combining BERT and GPT. BART is effective for sequence-to-sequence tasks.",
    related: ["BERT", "GPT", "Encoder-Decoder Model"],
    vendors: ["Meta", "Hugging Face"]
  },
  {
    term: "RoBERTa",
    category: "AI/ML",
    definition: "Robustly optimized BERT pre-training — an improved BERT with better pre-training. RoBERTa achieves state-of-the-art on many tasks.",
    related: ["BERT", "Language Model"],
    vendors: ["Meta", "Hugging Face"]
  },
  {
    term: "ELECTRA",
    category: "AI/ML",
    definition: "A language model using discriminative pre-training. ELECTRA is efficient and effective.",
    related: ["Language Model", "Pre-training"],
    vendors: ["Google", "Hugging Face"]
  },
  {
    term: "ALBERT",
    category: "AI/ML",
    definition: "A Lite BERT reducing parameters through factorization. ALBERT is parameter-efficient.",
    related: ["BERT", "Parameter Efficiency"],
    vendors: ["Google", "Hugging Face"]
  },
  {
    term: "DistilBERT",
    category: "AI/ML",
    definition: "A distilled version of BERT with 40% fewer parameters. DistilBERT runs faster while retaining performance.",
    related: ["BERT", "Knowledge Distillation", "Model Compression"],
    vendors: ["Hugging Face"]
  },
  {
    term: "ERNIE",
    category: "AI/ML",
    definition: "Enhanced Representation through Knowledge — a language model enhanced with knowledge. ERNIE improves knowledge-intensive tasks.",
    related: ["Language Model", "Knowledge Integration"],
    vendors: ["Baidu"]
  },
  {
    term: "XLNET",
    category: "AI/ML",
    definition: "An autoregressive language model with two-stream self-attention. XLNet avoids BERT's masked token problem.",
    related: ["Language Model", "Autoregressive Model"],
    vendors: ["Google", "Hugging Face"]
  },
  {
    term: "Megatron-LM",
    category: "AI/ML",
    definition: "A framework for distributed training of large language models. Megatron enables efficient scaling.",
    related: ["Distributed Training", "Large Language Model"],
    vendors: ["NVIDIA"]
  },
  {
    term: "DeepSpeed",
    category: "AI/ML",
    definition: "A deep learning library enabling training of massive models efficiently. DeepSpeed optimizes distributed training.",
    related: ["Distributed Training", "Model Optimization"],
    vendors: ["Microsoft"]
  },

  /* ========== VISION TRANSFORMER VARIANTS ========== */
  {
    term: "DeiT",
    category: "AI/ML",
    definition: "Data-Efficient Image Transformers using distillation. DeiT achieves ViT performance with fewer parameters.",
    related: ["Vision Transformer", "Knowledge Distillation"],
    vendors: ["Meta", "PyTorch"]
  },
  {
    term: "Swin Transformer",
    category: "AI/ML",
    definition: "A vision transformer with shifted windows for efficiency. Swin achieves hierarchical feature representation.",
    related: ["Vision Transformer", "Transformer"],
    vendors: ["Microsoft", "PyTorch"]
  },
  {
    term: "BEIT",
    category: "AI/ML",
    definition: "BERT Image Embeddings using masked image modeling. BEIT applies BERT pre-training to vision.",
    related: ["Vision Transformer", "Masked Language Modeling"],
    vendors: ["Microsoft"]
  },
  {
    term: "MAE",
    category: "AI/ML",
    definition: "Masked Autoencoders for image self-supervised learning. MAE learns visual representations effectively.",
    related: ["Vision Transformer", "Self-Supervised Learning", "Autoencoder"],
    vendors: ["Meta"]
  },
  {
    term: "ViLBERT",
    category: "AI/ML",
    definition: "A model that learns separate transformer streams for vision and language. ViLBERT enables vision-language understanding.",
    related: ["Vision Transformer", "Multimodal Learning"],
    vendors: ["Facebook AI"]
  },
  {
    term: "UniCom",
    category: "AI/ML",
    definition: "Universal Computer Vision Model treating vision tasks uniformly. UniCom unifies vision task processing.",
    related: ["Vision Transformer", "Universal Model"],
    vendors: ["Various"]
  },

  /* ========== CONVOLUTIONAL VARIANTS ========== */
  {
    term: "Depthwise Separable Convolution",
    category: "AI/ML",
    definition: "A convolution splitting into depthwise and pointwise components. Depthwise-separable reduces computation.",
    related: ["Convolution", "Model Compression"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Dilated Convolution",
    category: "AI/ML",
    definition: "A convolution with gaps between kernel elements increasing receptive field. Dilated convolution captures larger context.",
    related: ["Convolution", "Receptive Field"],
    vendors: ["PyTorch"]
  },
  {
    term: "Grouped Convolution",
    category: "AI/ML",
    definition: "A convolution separating channels into groups. Grouped convolution reduces computation.",
    related: ["Convolution", "Model Efficiency"],
    vendors: ["PyTorch"]
  },
  {
    term: "Transposed Convolution",
    category: "AI/ML",
    definition: "An upsampling operation learned through convolution. Transposed convolution is used in generative models.",
    related: ["Convolution", "Upsampling", "Generative Model"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Deconvolution",
    category: "AI/ML",
    definition: "Another term for transposed convolution used for upsampling. Deconvolution learned to invert convolution.",
    related: ["Transposed Convolution", "Upsampling"],
    vendors: ["Various"]
  },
  {
    term: "Standard Convolution",
    category: "AI/ML",
    definition: "The basic convolution operation with full kernels. Standard convolution is computationally expensive.",
    related: ["Convolution", "Convolutional Neural Network"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Point-Wise Convolution",
    category: "AI/ML",
    definition: "A 1x1 convolution changing channel dimensions. Pointwise convolution is computationally efficient.",
    related: ["Convolution", "Model Efficiency"],
    vendors: ["PyTorch"]
  },
  {
    term: "Receptive Field",
    category: "AI/ML",
    definition: "The region of input that influences an output neuron. Larger receptive field captures more context.",
    related: ["Convolution", "Dilated Convolution"],
    vendors: ["Various"]
  },

  /* ========== POOLING VARIANTS ========== */
  {
    term: "Max Pooling",
    category: "AI/ML",
    definition: "Selecting maximum values in pooling regions. Max pooling is aggressive downsampling.",
    related: ["Pooling", "Convolutional Neural Network"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Average Pooling",
    category: "AI/ML",
    definition: "Computing average values in pooling regions. Average pooling is gentler than max pooling.",
    related: ["Pooling", "Convolutional Neural Network"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Stochastic Pooling",
    category: "AI/ML",
    definition: "Randomly selecting activations for pooling with probability. Stochastic pooling provides regularization.",
    related: ["Pooling", "Regularization"],
    vendors: ["PyTorch"]
  },
  {
    term: "Adaptive Average Pooling",
    category: "AI/ML",
    definition: "Average pooling adapting to produce fixed output size. Adaptive pooling enables variable input sizes.",
    related: ["Average Pooling", "Pooling"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Adaptive Max Pooling",
    category: "AI/ML",
    definition: "Max pooling adapting to produce fixed output size. Adaptive pooling handles variable inputs.",
    related: ["Max Pooling", "Pooling"],
    vendors: ["PyTorch"]
  },
  {
    term: "Global Average Pooling",
    category: "AI/ML",
    definition: "Averaging entire feature map to single value. Global average pooling reduces computation.",
    related: ["Average Pooling", "Model Compression"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Global Max Pooling",
    category: "AI/ML",
    definition: "Taking maximum across entire feature map. Global max pooling extracts most salient features.",
    related: ["Max Pooling", "Pooling"],
    vendors: ["PyTorch"]
  },

  /* ========== SAMPLING TECHNIQUES ========== */
  {
    term: "Oversampling",
    category: "AI/ML",
    definition: "Duplicating minority class samples to balance datasets. Oversampling can cause overfitting.",
    related: ["Class Imbalance", "Sampling", "Data Preprocessing"],
    vendors: ["Imbalanced-learn"]
  },
  {
    term: "Undersampling",
    category: "AI/ML",
    definition: "Removing majority class samples to balance datasets. Undersampling loses information.",
    related: ["Class Imbalance", "Sampling"],
    vendors: ["Imbalanced-learn"]
  },
  {
    term: "SMOTE",
    category: "AI/ML",
    definition: "Synthetic Minority Oversampling Technique creating synthetic minority samples. SMOTE balances without duplication.",
    related: ["Oversampling", "Class Imbalance"],
    vendors: ["Imbalanced-learn"]
  },
  {
    term: "ADASYN",
    category: "AI/ML",
    definition: "Adaptive Synthetic Sampling generating samples adaptively. ADASYN focuses on harder minority examples.",
    related: ["SMOTE", "Class Imbalance"],
    vendors: ["Imbalanced-learn"]
  },
  {
    term: "Stratified Sampling",
    category: "AI/ML",
    definition: "Sampling maintaining class distribution in subsets. Stratified sampling preserves balance.",
    related: ["Sampling", "Cross-Validation"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Stratified K-Fold",
    category: "AI/ML",
    definition: "K-fold cross-validation preserving class distribution in each fold. Stratified K-fold is important for imbalanced data.",
    related: ["Cross-Validation", "Stratified Sampling"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Importance Sampling",
    category: "AI/ML",
    definition: "Sampling from different distributions to estimate expectations. Importance sampling is used in variational inference.",
    related: ["Sampling", "Variational Inference"],
    vendors: ["PyMC"]
  },
  {
    term: "Rejection Sampling",
    category: "AI/ML",
    definition: "Sampling from complex distributions by accepting/rejecting proposals. Rejection sampling is simple but inefficient.",
    related: ["Sampling", "Probabilistic Model"],
    vendors: ["PyMC"]
  },
  {
    term: "Gibbs Sampling",
    category: "AI/ML",
    definition: "Sampling from multivariate distributions by sampling conditionals. Gibbs sampling is a MCMC method.",
    related: ["MCMC", "Sampling"],
    vendors: ["PyMC"]
  },
  {
    term: "Metropolis-Hastings",
    category: "AI/ML",
    definition: "An MCMC algorithm using proposal distributions and acceptance ratios. Metropolis-Hastings is general and powerful.",
    related: ["MCMC", "Sampling"],
    vendors: ["PyMC"]
  },

  /* ========== MATRIX OPERATIONS & LINEAR ALGEBRA ========== */
  {
    term: "Eigenvalue Decomposition",
    category: "AI/ML",
    definition: "Decomposing matrices into eigenvalues and eigenvectors. Eigendecomposition reveals matrix structure.",
    related: ["Linear Algebra", "Matrix Factorization"],
    vendors: ["NumPy", "SciPy"]
  },
  {
    term: "Cholesky Decomposition",
    category: "AI/ML",
    definition: "Decomposing positive definite matrices into triangular factors. Cholesky is efficient for solving linear systems.",
    related: ["Matrix Decomposition", "Linear Algebra"],
    vendors: ["NumPy"]
  },
  {
    term: "QR Decomposition",
    category: "AI/ML",
    definition: "Decomposing matrices into orthogonal and triangular factors. QR is used for solving least squares problems.",
    related: ["Matrix Decomposition", "Linear Algebra"],
    vendors: ["NumPy"]
  },
  {
    term: "Tensor Decomposition",
    category: "AI/ML",
    definition: "Decomposing multi-dimensional tensors. Tensor decomposition generalizes matrix factorization.",
    related: ["Matrix Factorization", "Dimensionality Reduction"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Tucker Decomposition",
    category: "AI/ML",
    definition: "A tensor decomposition generalizing SVD to multiple dimensions. Tucker decomposition preserves structure.",
    related: ["Tensor Decomposition"],
    vendors: ["TensorFlow"]
  },
  {
    term: "CP Decomposition",
    category: "AI/ML",
    definition: "CANDECOMP/PARAFAC decomposition factorizing tensors as sums of rank-1 tensors. CP is interpretable.",
    related: ["Tensor Decomposition"],
    vendors: ["TensorFlow"]
  },
  {
    term: "Kronecker Product",
    category: "AI/ML",
    definition: "A matrix operation combining two matrices. Kronecker product is used in multi-task learning.",
    related: ["Matrix Operations", "Linear Algebra"],
    vendors: ["NumPy"]
  },
  {
    term: "Trace",
    category: "AI/ML",
    definition: "The sum of diagonal elements of a matrix. Trace is used in loss functions and analysis.",
    related: ["Matrix Operations"],
    vendors: ["NumPy"]
  },
  {
    term: "Frobenius Norm",
    category: "AI/ML",
    definition: "The Euclidean norm of a matrix treating it as vector. Frobenius norm measures matrix size.",
    related: ["Matrix Operations", "Norm"],
    vendors: ["NumPy"]
  },
  {
    term: "Spectral Norm",
    category: "AI/ML",
    definition: "The largest singular value of a matrix. Spectral norm bounds matrix-vector products.",
    related: ["Matrix Operations", "Singular Value"],
    vendors: ["NumPy"]
  },

  /* ========== OPTIMIZATION VARIANTS ========== */
  {
    term: "Adadelta",
    category: "AI/ML",
    definition: "An optimizer accumulating squared gradients like RMSprop but without learning rate. Adadelta adapts learning rate per dimension.",
    related: ["Optimizer", "Gradient Descent"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Adagrad",
    category: "AI/ML",
    definition: "An optimizer with adaptive per-parameter learning rates. Adagrad penalizes frequently updated parameters.",
    related: ["Optimizer", "Gradient Descent"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "RMSprop",
    category: "AI/ML",
    definition: "Root Mean Square Propagation — an optimizer using exponential moving average of squared gradients. RMSprop adapts learning rate.",
    related: ["Optimizer", "Adam Optimizer"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Nadam",
    category: "AI/ML",
    definition: "Nesterov-accelerated Adaptive Moment Estimation combining Nesterov and Adam. Nadam often converges faster.",
    related: ["Adam Optimizer", "Optimizer"],
    vendors: ["PyTorch"]
  },
  {
    term: "AdamW",
    category: "AI/ML",
    definition: "Adam with decoupled weight decay fixing weight decay in Adam. AdamW improves generalization.",
    related: ["Adam Optimizer", "Weight Decay"],
    vendors: ["PyTorch", "Hugging Face"]
  },
  {
    term: "LAMB",
    category: "AI/ML",
    definition: "Layer-wise Adaptive Moments optimizer for Batch training. LAMB enables large batch sizes.",
    related: ["Optimizer", "Distributed Training"],
    vendors: ["PyTorch"]
  },
  {
    term: "LARS",
    category: "AI/ML",
    definition: "Layer-wise Adaptive Rate Scaling adjusting learning rates per layer. LARS enables large-batch training.",
    related: ["Optimizer", "Learning Rate"],
    vendors: ["PyTorch"]
  },
  {
    term: "RAdam",
    category: "AI/ML",
    definition: "Rectified Adam with variance rectification in early training. RAdam addresses Adam's variance problem.",
    related: ["Adam Optimizer", "Optimizer"],
    vendors: ["PyTorch"]
  },
  {
    term: "MADGRAD",
    category: "AI/ML",
    definition: "An optimizer using gradient moments and variance. MADGRAD is effective for deep learning.",
    related: ["Optimizer", "Gradient Descent"],
    vendors: ["Facebook"]
  },
  {
    term: "Lookahead",
    category: "AI/ML",
    definition: "A meta-optimizer that maintains fast and slow weights. Lookahead improves convergence.",
    related: ["Optimizer", "Meta-Learning"],
    vendors: ["PyTorch"]
  },

  /* ========== DISTRIBUTED TRAINING ========== */
  {
    term: "Data Parallelism",
    category: "AI/ML",
    definition: "Distributing training data across devices computing gradients independently. Data parallelism is simple but communication-heavy.",
    related: ["Distributed Training", "Model Parallelism"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Model Parallelism",
    category: "AI/ML",
    definition: "Splitting model across devices enabling training of larger models. Model parallelism reduces memory per device.",
    related: ["Distributed Training", "Data Parallelism"],
    vendors: ["PyTorch", "Megatron-LM"]
  },
  {
    term: "Pipeline Parallelism",
    category: "AI/ML",
    definition: "Distributing model layers across devices and pipelining batches. Pipeline parallelism improves utilization.",
    related: ["Model Parallelism", "Distributed Training"],
    vendors: ["Megatron-LM", "PipeDream"]
  },
  {
    term: "Ring AllReduce",
    category: "AI/ML",
    definition: "An efficient collective communication pattern for distributed training. Ring AllReduce reduces communication overhead.",
    related: ["Distributed Training", "Communication"],
    vendors: ["PyTorch", "Horovod"]
  },
  {
    term: "Gradient Accumulation",
    category: "AI/ML",
    definition: "Accumulating gradients over multiple batches before update. Gradient accumulation enables larger effective batch sizes.",
    related: ["Optimization", "Training"],
    vendors: ["PyTorch"]
  },
  {
    term: "Mixed Precision Training",
    category: "AI/ML",
    definition: "Using lower precision (float16) for speed and memory with float32 for stability. Mixed precision accelerates training.",
    related: ["Distributed Training", "Quantization"],
    vendors: ["NVIDIA Apex", "PyTorch"]
  },
  {
    term: "Automatic Mixed Precision",
    abbr: "AMP",
    category: "AI/ML",
    definition: "Automatically using mixed precision during training. AMP is convenient for efficient training.",
    related: ["Mixed Precision Training", "Optimization"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Gradient Checkpointing",
    category: "AI/ML",
    definition: "Trading computation for memory by recomputing activations. Gradient checkpointing enables training with limited memory.",
    related: ["Memory Efficiency", "Training"],
    vendors: ["PyTorch"]
  },
  {
    term: "ZeRO",
    category: "AI/ML",
    definition: "Zero Redundancy Optimizer partitioning parameters, gradients and optimizers. ZeRO drastically reduces memory.",
    related: ["Memory Efficiency", "Distributed Training"],
    vendors: ["DeepSpeed"]
  },

  /* ========== SPECIFIC DATASETS ========== */
  {
    term: "Pascal VOC",
    category: "AI/ML",
    definition: "Pascal Visual Object Classes dataset with object detection and segmentation annotations. Pascal VOC was influential for object detection.",
    related: ["Benchmark Dataset", "Object Detection"],
    vendors: ["University of Leeds"]
  },
  {
    term: "MS COCO",
    category: "AI/ML",
    definition: "Microsoft Common Objects in Context dataset. MS COCO is the standard for object detection.",
    related: ["COCO Dataset", "Benchmark Dataset"],
    vendors: ["Microsoft"]
  },
  {
    term: "CityScapes",
    category: "AI/ML",
    definition: "A dataset for urban scene understanding with semantic segmentation labels. Cityscape is used for autonomous driving research.",
    related: ["Semantic Segmentation", "Benchmark Dataset"],
    vendors: ["Various"]
  },
  {
    term: "ADE20K",
    category: "AI/ML",
    definition: "A large-scale scene parsing dataset with semantic segmentation. ADE20K has diverse scenes and objects.",
    related: ["Semantic Segmentation", "Benchmark Dataset"],
    vendors: ["MIT"]
  },
  {
    term: "Places",
    category: "AI/ML",
    definition: "A large-scale scene understanding dataset with 365 place categories. Places enables scene classification.",
    related: ["Image Classification", "Benchmark Dataset"],
    vendors: ["MIT"]
  },
  {
    term: "Kinetics",
    category: "AI/ML",
    definition: "A large-scale video action dataset with millions of videos. Kinetics is standard for action recognition.",
    related: ["Action Recognition", "Benchmark Dataset"],
    vendors: ["DeepMind"]
  },
  {
    term: "UCF101",
    category: "AI/ML",
    definition: "A dataset of 101 action categories in videos. UCF101 is a popular action recognition benchmark.",
    related: ["Action Recognition", "Benchmark Dataset"],
    vendors: ["University of Central Florida"]
  },
  {
    term: "ActivityNet",
    category: "AI/ML",
    definition: "A large-scale video understanding dataset with temporal annotations. ActivityNet includes action localization.",
    related: ["Video Understanding", "Benchmark Dataset"],
    vendors: ["Various"]
  },
  {
    term: "VCR",
    category: "AI/ML",
    definition: "Visual Commonsense Reasoning dataset for reasoning about images. VCR tests visual understanding.",
    related: ["Visual Question Answering", "Benchmark Dataset"],
    vendors: ["Various"]
  },
  {
    term: "WebVision",
    category: "AI/ML",
    definition: "A web-scale weakly-supervised dataset for image classification. WebVision tests learning from noisy labels.",
    related: ["Image Classification", "Benchmark Dataset"],
    vendors: ["Google"]
  },
  {
    term: "Open Images",
    category: "AI/ML",
    definition: "A large-scale dataset with diverse images and annotations. Open Images includes detection, segmentation and more.",
    related: ["Benchmark Dataset", "Computer Vision"],
    vendors: ["Google"]
  },
  {
    term: "WikiText",
    category: "AI/ML",
    definition: "A language modeling dataset from Wikipedia. WikiText is used for evaluating language models.",
    related: ["Language Modeling", "Benchmark Dataset"],
    vendors: ["Salesforce"]
  },
  {
    term: "GLUE",
    category: "AI/ML",
    definition: "General Language Understanding Evaluation benchmark. GLUE evaluates language understanding models.",
    related: ["Language Understanding", "Benchmark Dataset"],
    vendors: ["NYU/UW"]
  },
  {
    term: "SuperGLUE",
    category: "AI/ML",
    definition: "A harder version of GLUE with more challenging tasks. SuperGLUE tests advanced understanding.",
    related: ["GLUE", "Benchmark Dataset"],
    vendors: ["NYU"]
  },
  {
    term: "MMLU",
    category: "AI/ML",
    definition: "Massive Multitask Language Understanding evaluating knowledge. MMLU tests broad knowledge across domains.",
    related: ["Benchmark Dataset", "Knowledge"],
    vendors: ["Various"]
  },

  /* ========== QUANTIZATION & PRUNING SPECIFIC ========== */
  {
    term: "Integer Quantization",
    category: "AI/ML",
    definition: "Quantizing to integer representations (typically int8). Integer quantization enables efficient inference.",
    related: ["Quantization", "Model Compression"],
    vendors: ["TensorFlow Lite", "ONNX"]
  },
  {
    term: "Post-Training Quantization",
    category: "AI/ML",
    definition: "Quantizing models after training without retraining. Post-training quantization is fast but less accurate.",
    related: ["Quantization"],
    vendors: ["TensorFlow Lite"]
  },
  {
    term: "Quantization-Aware Training",
    abbr: "QAT",
    category: "AI/ML",
    definition: "Training with quantization simulated to adapt to lower precision. QAT maintains accuracy better.",
    related: ["Quantization", "Training"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Symmetric Quantization",
    category: "AI/ML",
    definition: "Quantizing with symmetric ranges around zero. Symmetric quantization is simpler but less efficient.",
    related: ["Quantization"],
    vendors: ["Various"]
  },
  {
    term: "Asymmetric Quantization",
    category: "AI/ML",
    definition: "Quantizing with asymmetric ranges maximizing precision. Asymmetric quantization is more efficient.",
    related: ["Quantization"],
    vendors: ["TensorFlow Lite"]
  },
  {
    term: "Per-Channel Quantization",
    category: "AI/ML",
    definition: "Quantizing each channel independently. Per-channel quantization preserves fine-grained information.",
    related: ["Quantization"],
    vendors: ["TensorFlow Lite"]
  },
  {
    term: "Per-Layer Quantization",
    category: "AI/ML",
    definition: "Quantizing entire layers uniformly. Per-layer quantization is simpler but coarser.",
    related: ["Quantization"],
    vendors: ["Various"]
  },
  {
    term: "Magnitude Pruning",
    category: "AI/ML",
    definition: "Removing weights with small magnitudes. Magnitude pruning is simple and effective.",
    related: ["Pruning", "Model Compression"],
    vendors: ["TensorFlow", "PyTorch"]
  },
  {
    term: "Structured Pruning",
    category: "AI/ML",
    definition: "Pruning entire channels or filters for hardware efficiency. Structured pruning maintains speedups.",
    related: ["Pruning", "Model Compression"],
    vendors: ["PyTorch"]
  },
  {
    term: "Unstructured Pruning",
    category: "AI/ML",
    definition: "Pruning individual weights for compression. Unstructured pruning reduces size but not speed.",
    related: ["Pruning", "Model Compression"],
    vendors: ["PyTorch"]
  },
  {
    term: "Lottery Ticket Hypothesis",
    category: "AI/ML",
    definition: "A hypothesis that pruned subnetworks can match full network performance. Lottery tickets suggest networks are overparameterized.",
    related: ["Pruning", "Model Compression"],
    vendors: ["MIT"]
  },

  /* ========== ENSEMBLE METHODS SPECIFIC ========== */
  {
    term: "Voting Ensemble",
    category: "AI/ML",
    definition: "Combining predictions through voting (majority or weighted). Voting is simple ensemble method.",
    related: ["Ensemble Learning"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Averaging Ensemble",
    category: "AI/ML",
    definition: "Averaging predictions from multiple models. Averaging works well for regression.",
    related: ["Ensemble Learning"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Stacking",
    category: "AI/ML",
    definition: "Training a meta-learner on predictions of base learners. Stacking leverages complementary models.",
    related: ["Ensemble Learning"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Blending",
    category: "AI/ML",
    definition: "A simplified stacking using holdout set instead of cross-validation. Blending is faster than stacking.",
    related: ["Stacking", "Ensemble Learning"],
    vendors: ["Kaggle"]
  },
  {
    term: "Snapshot Ensemble",
    category: "AI/ML",
    definition: "Saving models at different learning rate cycles. Snapshot ensemble uses multiple local minima.",
    related: ["Ensemble Learning", "Learning Rate Scheduling"],
    vendors: ["PyTorch"]
  },
  {
    term: "Multi-Loss Ensembling",
    category: "AI/ML",
    definition: "Training models with different loss functions and ensembling. Multi-loss provides diverse predictions.",
    related: ["Ensemble Learning", "Loss Function"],
    vendors: ["Various"]
  },

  /* ========== SPECIFIC APPLICATIONS ========== */
  {
    term: "Recommendation Engine",
    category: "AI/ML",
    definition: "A system recommending items to users. Recommendation engines are crucial for platforms.",
    related: ["Recommendation System", "Collaborative Filtering"],
    vendors: ["Various"]
  },
  {
    term: "Click-Through Rate Prediction",
    abbr: "CTR Prediction",
    category: "AI/ML",
    definition: "Predicting probability users click ads. CTR prediction is important for advertising.",
    related: ["Classification", "Prediction"],
    vendors: ["Various"]
  },
  {
    term: "Churn Prediction",
    category: "AI/ML",
    definition: "Predicting which customers will leave. Churn prediction enables retention strategies.",
    related: ["Prediction", "Business Analytics"],
    vendors: ["Various"]
  },
  {
    term: "Next-Item Prediction",
    category: "AI/ML",
    definition: "Predicting next item user will interact with. Next-item prediction is fundamental for recommendations.",
    related: ["Recommendation System", "Sequence Prediction"],
    vendors: ["Various"]
  },
  {
    term: "User Segmentation",
    category: "AI/ML",
    definition: "Dividing users into groups for targeting. User segmentation enables personalization.",
    related: ["Clustering", "Business Analytics"],
    vendors: ["Various"]
  },
  {
    term: "Customer Lifetime Value",
    abbr: "CLV",
    category: "AI/ML",
    definition: "Predicting total revenue from a customer. CLV prediction guides marketing investment.",
    related: ["Prediction", "Business Analytics"],
    vendors: ["Various"]
  },
  {
    term: "Propensity Modeling",
    category: "AI/ML",
    definition: "Predicting likelihood customers perform actions. Propensity models guide targeting.",
    related: ["Prediction", "Classification"],
    vendors: ["Various"]
  },
  {
    term: "Attribution Modeling",
    category: "AI/ML",
    definition: "Assigning credit to marketing touchpoints. Attribution models guide budget allocation.",
    related: ["Causal Inference", "Business Analytics"],
    vendors: ["Various"]
  },
  {
    term: "Demand Forecasting",
    category: "AI/ML",
    definition: "Predicting future demand for products. Demand forecasting optimizes inventory.",
    related: ["Time Series Prediction", "Forecasting"],
    vendors: ["Facebook Prophet"]
  },
  {
    term: "Supply Chain Optimization",
    category: "AI/ML",
    definition: "Optimizing logistics and supply chains. Supply chain optimization reduces costs.",
    related: ["Optimization", "Prediction"],
    vendors: ["Various"]
  },

  /* ========== SPECIFIC EMBEDDING METHODS ========== */
  {
    term: "FastText",
    category: "AI/ML",
    definition: "An extension of Word2Vec handling out-of-vocabulary words. FastText learns character n-gram embeddings.",
    related: ["Embedding", "Word2Vec"],
    vendors: ["Facebook"]
  },
  {
    term: "Sentence Embeddings",
    category: "AI/ML",
    definition: "Dense vectors representing entire sentences. Sentence embeddings enable semantic comparison.",
    related: ["Embedding", "Natural Language Processing"],
    vendors: ["Sentence Transformers"]
  },
  {
    term: "Document Embeddings",
    category: "AI/ML",
    definition: "Dense vectors representing documents. Document embeddings enable document classification and clustering.",
    related: ["Embedding", "Doc2Vec"],
    vendors: ["Gensim"]
  },
  {
    term: "Doc2Vec",
    category: "AI/ML",
    definition: "An extension of Word2Vec to documents. Doc2Vec learns fixed-size document vectors.",
    related: ["Word2Vec", "Document Embeddings"],
    vendors: ["Gensim"]
  },
  {
    term: "Knowledge Graph Embedding",
    category: "AI/ML",
    definition: "Learning embeddings of entities and relations. Knowledge embeddings enable reasoning.",
    related: ["Knowledge Graph", "Embedding"],
    vendors: ["Various"]
  },
  {
    term: "TransE",
    category: "AI/ML",
    definition: "Translation-based knowledge graph embedding. TransE models relations as translations.",
    related: ["Knowledge Graph Embedding"],
    vendors: ["Various"]
  },
  {
    term: "Contextual Embeddings",
    category: "AI/ML",
    definition: "Embeddings that vary based on context (unlike static embeddings). Contextual embeddings capture polysemy.",
    related: ["Embedding", "BERT", "ELMo"],
    vendors: ["Hugging Face"]
  },
  {
    term: "ELMo",
    category: "AI/ML",
    definition: "Embeddings from Language Models using bidirectional LSTMs. ELMo learns contextualized representations.",
    related: ["Contextual Embeddings", "Language Model"],
    vendors: ["AllenAI"]
  },
  {
    term: "Static Embeddings",
    category: "AI/ML",
    definition: "Fixed embeddings for each word regardless of context. Static embeddings are simple but limited.",
    related: ["Embedding", "Word2Vec"],
    vendors: ["Various"]
  },
  {
    term: "Subword Embeddings",
    category: "AI/ML",
    definition: "Embeddings at subword level (characters or BPE). Subword embeddings handle rare words.",
    related: ["Embedding", "Tokenization"],
    vendors: ["FastText"]
  },
  {
    term: "Cross-Lingual Embeddings",
    category: "AI/ML",
    definition: "Embeddings spanning multiple languages in shared space. Cross-lingual embeddings enable multilingual tasks.",
    related: ["Embedding", "Machine Translation"],
    vendors: ["MUSE", "Hugging Face"]
  },
  {
    term: "Bilingual Embeddings",
    category: "AI/ML",
    definition: "Embeddings bridging two languages. Bilingual embeddings enable translation and transfer.",
    related: ["Cross-Lingual Embeddings"],
    vendors: ["MUSE"]
  },

  /* ========== SPECIFIC DEEP LEARNING TECHNIQUES ========== */
  {
    term: "Residual Connections",
    category: "AI/ML",
    definition: "Skip connections allowing information to bypass layers. Residual connections improve gradient flow.",
    related: ["ResNet", "Deep Learning"],
    vendors: ["PyTorch", "TensorFlow"]
  },
  {
    term: "Attention Head",
    category: "AI/ML",
    definition: "A single attention mechanism in multi-head attention. Attention heads capture different representation aspects.",
    related: ["Multi-Head Attention", "Attention Mechanism"],
    vendors: ["Transformers"]
  },
  {
    term: "Query-Key-Value",
    abbr: "QKV",
    category: "AI/ML",
    definition: "The three components of attention mechanism. QKV enables flexible attention computation.",
    related: ["Attention Mechanism", "Self-Attention"],
    vendors: ["PyTorch"]
  },
  {
    term: "Positional Encoding",
    category: "AI/ML",
    definition: "Adding position information to embeddings in transformers. Positional encodings preserve order.",
    related: ["Transformer", "Embedding"],
    vendors: ["PyTorch"]
  },
  {
    term: "Absolute Positional Encoding",
    category: "AI/ML",
    definition: "Encoding absolute positions in sequences. Absolute encoding is traditional but has length issues.",
    related: ["Positional Encoding", "Transformer"],
    vendors: ["Transformers"]
  },
  {
    term: "Relative Positional Encoding",
    category: "AI/ML",
    definition: "Encoding relative distances between positions. Relative encoding improves length generalization.",
    related: ["Positional Encoding", "Transformer"],
    vendors: ["Hugging Face"]
  },
  {
    term: "Token Embedding",
    category: "AI/ML",
    definition: "Converting tokens to dense vectors. Token embeddings are foundation for language models.",
    related: ["Embedding", "Tokenization"],
    vendors: ["Hugging Face"]
  },
  {
    term: "Feed-Forward Network",
    category: "AI/ML",
    definition: "Fully connected layers in transformer blocks. Feed-forward networks enable non-linearity.",
    related: ["Transformer", "Neural Network"],
    vendors: ["PyTorch"]
  },
  {
    term: "Sequence Masking",
    category: "AI/ML",
    definition: "Preventing attention to future tokens (causal masking). Sequence masking enables autoregressive generation.",
    related: ["Attention Mechanism", "Autoregressive Model"],
    vendors: ["PyTorch"]
  },
  {
    term: "Causal Masking",
    category: "AI/ML",
    definition: "Masking future positions in attention. Causal masking enforces left-to-right generation.",
    related: ["Sequence Masking", "Autoregressive Model"],
    vendors: ["PyTorch"]
  },
  {
    term: "Padding Masking",
    category: "AI/ML",
    definition: "Masking padding tokens in attention. Padding masking prevents attending to padding.",
    related: ["Sequence Masking", "Attention Mechanism"],
    vendors: ["PyTorch"]
  },
  {
    term: "Layer Drop",
    category: "AI/ML",
    definition: "Randomly dropping transformer layers during training. Layer drop is a regularization technique.",
    related: ["Dropout", "Regularization"],
    vendors: ["Hugging Face"]
  },
  {
    term: "Encoder Stacking",
    category: "AI/ML",
    definition: "Stacking multiple encoder layers. Encoder stacking increases model capacity.",
    related: ["Transformer", "Deep Learning"],
    vendors: ["Transformers"]
  },
  {
    term: "Decoder Stacking",
    category: "AI/ML",
    definition: "Stacking multiple decoder layers. Decoder stacking enables complex generation.",
    related: ["Decoder", "Transformer"],
    vendors: ["Transformers"]
  },

  /* ========== SPECIFIC LEARNING PHENOMENA ========== */
  {
    term: "Double Descent",
    category: "AI/ML",
    definition: "A phenomenon where test error decreases then increases with model complexity. Double descent challenges bias-variance tradeoff.",
    related: ["Overfitting", "Generalization"],
    vendors: ["MIT"]
  },
  {
    term: "Neural Collapse",
    category: "AI/ML",
    definition: "A phenomenon where learned representations converge to structured geometry. Neural collapse enables generalization.",
    related: ["Representation Learning", "Deep Learning"],
    vendors: ["MIT"]
  },
  {
    term: "Feature Learning",
    category: "AI/ML",
    definition: "Automatic discovery of useful features during training. Feature learning is fundamental to deep learning.",
    related: ["Representation Learning", "Deep Learning"],
    vendors: ["Various"]
  },
  {
    term: "Grokking",
    category: "AI/ML",
    definition: "A phenomenon where models suddenly generalize after long training. Grokking reveals phase transitions in learning.",
    related: ["Generalization", "Training"],
    vendors: ["OpenAI"]
  },
  {
    term: "Mode Connectivity",
    category: "AI/ML",
    definition: "The existence of paths between high-performing solutions in loss landscape. Mode connectivity enables model merging.",
    related: ["Loss Landscape", "Optimization"],
    vendors: ["Various"]
  },
  {
    term: "Loss Landscape",
    category: "AI/ML",
    definition: "The visualization of loss function as function of parameters. Loss landscape reveals optimization geometry.",
    related: ["Optimization", "Convergence"],
    vendors: ["Various"]
  },
  {
    term: "Lottery Ticket",
    category: "AI/ML",
    definition: "A sparse subnetwork matching full network performance. Lottery tickets demonstrate overparameterization.",
    related: ["Pruning", "Sparse Model"],
    vendors: ["MIT"]
  },
  {
    term: "Critical Learning Period",
    category: "AI/ML",
    definition: "A period where corrupting data training particularly hurts. Critical periods reveal learning dynamics.",
    related: ["Training", "Learning Theory"],
    vendors: ["Facebook"]
  },
  {
    term: "Power Law Scaling",
    category: "AI/ML",
    definition: "Loss decreasing as power law with more data/compute. Power laws guide resource allocation.",
    related: ["Scaling Laws", "Generalization"],
    vendors: ["OpenAI"]
  },
  {
    term: "Scaling Laws",
    category: "AI/ML",
    definition: "Predictable relationships between model size, data and performance. Scaling laws guide model design.",
    related: ["Power Law Scaling", "Large Language Model"],
    vendors: ["OpenAI"]
  },

  /* ========== SPECIFIC EVALUATION PROTOCOLS ========== */
  {
    term: "Zero-Shot Evaluation",
    category: "AI/ML",
    definition: "Evaluating models on tasks without any task-specific training. Zero-shot evaluation tests transfer.",
    related: ["Zero-Shot Learning", "Evaluation"],
    vendors: ["Various"]
  },
  {
    term: "Few-Shot Evaluation",
    category: "AI/ML",
    definition: "Evaluating models with minimal task examples. Few-shot evaluation tests rapid adaptation.",
    related: ["Few-Shot Learning", "Evaluation"],
    vendors: ["Various"]
  },
  {
    term: "In-Domain Evaluation",
    category: "AI/ML",
    definition: "Testing on data from same distribution as training. In-domain evaluation measures fit to training distribution.",
    related: ["Evaluation Metrics", "Generalization"],
    vendors: ["Various"]
  },
  {
    term: "Out-of-Domain Evaluation",
    category: "AI/ML",
    definition: "Testing on different distribution than training. OOD evaluation measures robustness.",
    related: ["Domain Adaptation", "Evaluation"],
    vendors: ["Various"]
  },
  {
    term: "Adversarial Evaluation",
    category: "AI/ML",
    definition: "Testing with adversarially constructed examples. Adversarial evaluation reveals weaknesses.",
    related: ["Adversarial Attack", "Robustness"],
    vendors: ["Various"]
  },
  {
    term: "Human Evaluation",
    category: "AI/ML",
    definition: "Having humans rate model outputs. Human evaluation assesses quality beyond metrics.",
    related: ["Evaluation Metrics"],
    vendors: ["Various"]
  },
  {
    term: "Automatic Evaluation",
    category: "AI/ML",
    definition: "Using metrics to automatically score model outputs. Automatic evaluation is scalable.",
    related: ["Evaluation Metrics"],
    vendors: ["Various"]
  },
  {
    term: "Crowdsourcing Evaluation",
    category: "AI/ML",
    definition: "Using crowdworkers for large-scale evaluation. Crowdsourcing scales human evaluation.",
    related: ["Human Evaluation"],
    vendors: ["Amazon Mechanical Turk"]
  },

  /* ========== DEBUGGING & ANALYSIS ========== */
  {
    term: "Activation Analysis",
    category: "AI/ML",
    definition: "Analyzing neuron activations to understand learned representations. Activation analysis aids debugging.",
    related: ["Interpretability", "Debugging"],
    vendors: ["Various"]
  },
  {
    term: "Weight Analysis",
    category: "AI/ML",
    definition: "Analyzing learned weights to understand model behavior. Weight analysis reveals learned patterns.",
    related: ["Interpretability"],
    vendors: ["Various"]
  },
  {
    term: "Gradient Analysis",
    category: "AI/ML",
    definition: "Analyzing gradients during training. Gradient analysis reveals optimization issues.",
    related: ["Backpropagation", "Debugging"],
    vendors: ["Various"]
  },
  {
    term: "Confusion Matrix Analysis",
    category: "AI/ML",
    definition: "Detailed analysis of classification errors. Confusion matrix analysis identifies error patterns.",
    related: ["Confusion Matrix", "Error Analysis"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Error Analysis",
    category: "AI/ML",
    definition: "Analyzing types and patterns of model errors. Error analysis guides improvements.",
    related: ["Debugging", "Model Evaluation"],
    vendors: ["Various"]
  },
  {
    term: "Ablation Study",
    category: "AI/ML",
    definition: "Removing components to measure their contribution. Ablation studies reveal important components.",
    related: ["Evaluation", "Debugging"],
    vendors: ["Various"]
  },
  {
    term: "Sensitivity Analysis",
    category: "AI/ML",
    definition: "Measuring how output changes with input variations. Sensitivity analysis reveals robustness.",
    related: ["Robustness", "Evaluation"],
    vendors: ["Various"]
  },
  {
    term: "Hyperparameter Importance",
    category: "AI/ML",
    definition: "Ranking hyperparameters by their impact on performance. Hyperparameter importance guides tuning.",
    related: ["Hyperparameter Tuning", "AutoML"],
    vendors: ["Optuna"]
  },
  {
    term: "Feature Importance Ranking",
    category: "AI/ML",
    definition: "Ranking features by their contribution to predictions. Feature importance ranks reveal influential features.",
    related: ["Feature Importance", "Interpretability"],
    vendors: ["SHAP", "Lime"]
  },
  {
    term: "Learning Curves",
    category: "AI/ML",
    definition: "Plots of performance vs training set size. Learning curves diagnose overfitting vs underfitting.",
    related: ["Overfitting", "Underfitting"],
    vendors: ["Scikit-learn"]
  },

  /* ========== SPECIFIC NETWORK COMPONENTS ========== */
  {
    term: "Bottleneck Layer",
    category: "AI/ML",
    definition: "A layer with fewer units reducing dimensionality. Bottleneck layers compress information.",
    related: ["Neural Network", "Dimensionality Reduction"],
    vendors: ["TensorFlow"]
  },
  {
    term: "Squeeze-and-Excitation Block",
    category: "AI/ML",
    definition: "A module adaptively recalibrating channel feature maps. SE blocks improve feature relevance.",
    related: ["Attention Mechanism", "Neural Network"],
    vendors: ["PyTorch"]
  },
  {
    term: "Inception Module",
    category: "AI/ML",
    definition: "A network component with parallel paths of different sizes. Inception modules capture multi-scale features.",
    related: ["Convolutional Neural Network", "GoogLeNet"],
    vendors: ["TensorFlow"]
  },
  {
    term: "Residual Block",
    category: "AI/ML",
    definition: "A block with skip connection enabling deep networks. Residual blocks solve vanishing gradient.",
    related: ["ResNet", "Deep Learning"],
    vendors: ["PyTorch"]
  },
  {
    term: "Dense Block",
    category: "AI/ML",
    definition: "A block where each layer connects to all preceding layers. Dense blocks encourage feature reuse.",
    related: ["DenseNet", "Neural Network"],
    vendors: ["PyTorch"]
  },
  {
    term: "Fire Module",
    category: "AI/ML",
    definition: "A small module in SqueezeNet with squeeze and expand. Fire modules reduce parameters.",
    related: ["SqueezeNet", "Model Compression"],
    vendors: ["PyTorch"]
  },
  {
    term: "Depthwise Separable Block",
    category: "AI/ML",
    definition: "A block combining depthwise and pointwise convolutions. Depthwise-separable blocks are efficient.",
    related: ["MobileNet", "Efficient Architecture"],
    vendors: ["TensorFlow"]
  },
  {
    term: "Inverted Residual Block",
    category: "AI/ML",
    definition: "A residual block with wide intermediate layers. Inverted blocks are used in MobileNetV2.",
    related: ["MobileNet", "Residual Block"],
    vendors: ["PyTorch"]
  },
  {
    term: "Transformer Block",
    category: "AI/ML",
    definition: "A block with self-attention and feed-forward layers. Transformer blocks are units of transformers.",
    related: ["Transformer", "Self-Attention"],
    vendors: ["PyTorch"]
  },
  {
    term: "LSTM Cell",
    category: "AI/ML",
    definition: "The fundamental unit of LSTM networks. LSTM cells enable learning long-term dependencies.",
    related: ["LSTM", "Recurrent Neural Network"],
    vendors: ["PyTorch"]
  },

  /* ========== SPECIFIC TRAINING STRATEGIES ========== */
  {
    term: "Curriculum Learning",
    category: "AI/ML",
    definition: "Training on easier examples first then harder ones. Curriculum learning accelerates convergence.",
    related: ["Training", "Sample Ordering"],
    vendors: ["Various"]
  },
  {
    term: "Hard Example Mining",
    category: "AI/ML",
    definition: "Focusing training on difficult examples. Hard mining improves learning.",
    related: ["Training", "Sample Selection"],
    vendors: ["Various"]
  },
  {
    term: "Active Learning",
    category: "AI/ML",
    definition: "Selecting most informative unlabeled examples for labeling. Active learning reduces annotation cost.",
    related: ["Semi-Supervised Learning", "Sampling"],
    vendors: ["ModAL"]
  },
  {
    term: "Continual Learning",
    category: "AI/ML",
    definition: "Learning from sequential tasks without forgetting previous ones. Continual learning prevents catastrophic forgetting.",
    related: ["Lifelong Learning", "Transfer Learning"],
    vendors: ["Continual-AI"]
  },
  {
    term: "Lifelong Learning",
    category: "AI/ML",
    definition: "Learning continuously from new experiences. Lifelong learning mimics human learning.",
    related: ["Continual Learning", "Transfer Learning"],
    vendors: ["Various"]
  },
  {
    term: "Meta-Learning Training",
    category: "AI/ML",
    definition: "Training to learn how to learn quickly. Meta-training enables few-shot adaptation.",
    related: ["Meta-Learning", "Transfer Learning"],
    vendors: ["PyTorch"]
  },
  {
    term: "Multi-Task Learning Training",
    category: "AI/ML",
    definition: "Training on multiple related tasks simultaneously. Multi-task training improves generalization.",
    related: ["Transfer Learning", "Regularization"],
    vendors: ["PyTorch"]
  },
  {
    term: "Self-Training",
    category: "AI/ML",
    definition: "Using model predictions on unlabeled data as labels. Self-training leverages unlabeled data.",
    related: ["Semi-Supervised Learning", "Pseudo-Labeling"],
    vendors: ["Various"]
  },
  {
    term: "Pseudo-Labeling",
    category: "AI/ML",
    definition: "Assigning predicted labels to unlabeled data. Pseudo-labels boost semi-supervised learning.",
    related: ["Self-Training", "Semi-Supervised Learning"],
    vendors: ["Various"]
  },
  {
    term: "Teacher-Student Training",
    category: "AI/ML",
    definition: "Having student model learn from teacher model. Teacher-student enables knowledge transfer.",
    related: ["Knowledge Distillation", "Transfer Learning"],
    vendors: ["PyTorch"]
  },

  /* ========== SPECIFIC BENCHMARKS & TASKS ========== */
  {
    term: "Machine Reading Comprehension",
    abbr: "MRC",
    category: "AI/ML",
    definition: "A task where systems answer questions about text passages. MRC tests comprehension abilities.",
    related: ["Question Answering", "Natural Language Processing"],
    vendors: ["SQuAD"]
  },
  {
    term: "Natural Language Inference Task",
    category: "AI/ML",
    definition: "Tasks testing logical reasoning over text. NLI tasks evaluate reasoning capabilities.",
    related: ["Textual Entailment", "Natural Language Processing"],
    vendors: ["SNLI", "MultiNLI"]
  },
  {
    term: "Semantic Textual Similarity Task",
    abbr: "STS",
    category: "AI/ML",
    definition: "A task evaluating semantic similarity between sentence pairs. STS measures understanding.",
    related: ["Semantic Similarity", "Natural Language Processing"],
    vendors: ["SemEval"]
  },
  {
    term: "Visual Question Answering Task",
    category: "AI/ML",
    definition: "Answering free-form questions about images. VQA tests vision-language understanding.",
    related: ["Visual Question Answering", "Multimodal Learning"],
    vendors: ["VQA Dataset"]
  },
  {
    term: "Image-Text Matching",
    category: "AI/ML",
    definition: "Matching images with descriptions or captions. Image-text matching tests multimodal alignment.",
    related: ["Vision-Language Model", "Multimodal Learning"],
    vendors: ["Flickr30K", "COCO"]
  },
  {
    term: "Video Understanding",
    category: "AI/ML",
    definition: "Comprehensive understanding of video content. Video understanding combines spatial and temporal.",
    related: ["Action Recognition", "Computer Vision"],
    vendors: ["Various"]
  },
  {
    term: "Temporal Action Localization",
    category: "AI/ML",
    definition: "Finding when actions occur in videos. Temporal localization enables action understanding.",
    related: ["Action Recognition", "Video Understanding"],
    vendors: ["ActivityNet"]
  },
  {
    term: "Phrase Localization",
    category: "AI/ML",
    definition: "Localizing objects matching text descriptions. Phrase localization tests grounding.",
    related: ["Vision-Language Model", "Object Detection"],
    vendors: ["ReferIt", "RefCOCO"]
  },
  {
    term: "Compositional Reasoning",
    category: "AI/ML",
    definition: "Reasoning about novel combinations of known concepts. Compositional reasoning tests generalization.",
    related: ["Visual Reasoning", "Compositionality"],
    vendors: ["CLEVR"]
  },
  {
    term: "Commonsense Reasoning",
    category: "AI/ML",
    definition: "Reasoning requiring world knowledge and common sense. Commonsense reasoning is challenging.",
    related: ["Reasoning", "Knowledge"],
    vendors: ["ConceptNet", "CommonsenseQA"]
  },

  /* ========== SCIENTIFIC AI ========== */
  {
    term: "Physics-Informed Neural Networks",
    abbr: "PINN",
    category: "AI/ML",
    definition: "Neural networks trained with physics constraints. PINNs solve differential equations.",
    related: ["Deep Learning", "Scientific Computing"],
    vendors: ["DeepXDE"]
  },
  {
    term: "Scientific Machine Learning",
    category: "AI/ML",
    definition: "Applying machine learning to scientific problems. Scientific ML accelerates discovery.",
    related: ["Deep Learning", "Scientific Computing"],
    vendors: ["Various"]
  },
  {
    term: "Molecular Modeling",
    category: "AI/ML",
    definition: "Using machine learning for molecular properties and interactions. Molecular ML aids drug discovery.",
    related: ["Graph Neural Network", "Drug Discovery"],
    vendors: ["DeepChem"]
  },
  {
    term: "Protein Folding Prediction",
    category: "AI/ML",
    definition: "Predicting 3D structure of proteins. Protein folding is solved by AlphaFold.",
    related: ["Sequence Modeling", "Protein Structure Prediction"],
    vendors: ["DeepMind"]
  },
  {
    term: "Molecular Property Prediction",
    category: "AI/ML",
    definition: "Predicting chemical properties of molecules. Property prediction guides drug design.",
    related: ["Molecular Modeling", "Regression"],
    vendors: ["DeepChem"]
  },
  {
    term: "Quantum Machine Learning",
    category: "AI/ML",
    definition: "Using quantum computers for machine learning. Quantum ML is an emerging field.",
    related: ["Machine Learning", "Quantum Computing"],
    vendors: ["Qiskit", "PennyLane"]
  },
  {
    term: "Climate Modeling with AI",
    category: "AI/ML",
    definition: "Using machine learning for climate simulation. AI speeds up climate models.",
    related: ["Deep Learning", "Scientific Computing"],
    vendors: ["Various"]
  },
  {
    term: "Materials Discovery",
    category: "AI/ML",
    definition: "Using machine learning to discover new materials. ML accelerates materials science.",
    related: ["Graph Neural Network", "Property Prediction"],
    vendors: ["Various"]
  },

  /* ========== MISCELLANEOUS ADVANCED TOPICS ========== */
  {
    term: "Kernel Density Estimation",
    category: "AI/ML",
    definition: "Estimating probability density from samples. Kernel estimation is non-parametric.",
    related: ["Density Estimation", "Non-Parametric Methods"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Mixture Model",
    category: "AI/ML",
    definition: "A probabilistic model of mixture of distributions. Mixture models enable flexible modeling.",
    related: ["Probabilistic Model", "Gaussian Mixture Model"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Dirichlet Distribution",
    category: "AI/ML",
    definition: "A distribution over probability distributions. Dirichlet is used in topic models.",
    related: ["Probabilistic Model", "Topic Modeling"],
    vendors: ["PyMC"]
  },
  {
    term: "Latent Factor Model",
    category: "AI/ML",
    definition: "A model using latent factors to explain observations. Latent factors enable dimensionality reduction.",
    related: ["Factor Analysis", "Dimensionality Reduction"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Factor Analysis",
    category: "AI/ML",
    definition: "Assuming data comes from latent factors plus noise. Factor analysis is probabilistic PCA.",
    related: ["PCA", "Dimensionality Reduction"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Independent Component Analysis",
    abbr: "ICA",
    category: "AI/ML",
    definition: "Separating mixed signals into independent components. ICA is used for blind source separation.",
    related: ["Dimensionality Reduction", "Signal Processing"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Manifold Learning",
    category: "AI/ML",
    definition: "Assuming high-dimensional data lies on lower-dimensional manifold. Manifold learning enables meaningful dimensionality reduction.",
    related: ["Dimensionality Reduction", "Non-Linear Methods"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Isomap",
    category: "AI/ML",
    definition: "Isometric feature mapping preserving geodesic distances. Isomap discovers manifolds.",
    related: ["Manifold Learning", "Dimensionality Reduction"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Locally Linear Embedding",
    abbr: "LLE",
    category: "AI/ML",
    definition: "A manifold learning technique preserving local neighborhoods. LLE recovers manifold structure.",
    related: ["Manifold Learning", "Dimensionality Reduction"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Spectral Clustering",
    category: "AI/ML",
    definition: "A clustering approach using spectral decomposition of similarity matrix. Spectral clustering finds non-convex clusters.",
    related: ["Clustering", "Spectral Methods"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Affinity Propagation",
    category: "AI/ML",
    definition: "A clustering algorithm finding exemplars through message passing. Affinity propagation is unsupervised exemplar selection.",
    related: ["Clustering", "Graph-Based Methods"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Mean Shift Clustering",
    category: "AI/ML",
    definition: "A clustering approach finding modes of density. Mean shift discovers natural clusters.",
    related: ["Clustering", "Density-Based Methods"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Agglomerative Clustering",
    category: "AI/ML",
    definition: "Bottom-up hierarchical clustering merging closest clusters. Agglomerative clustering builds dendrograms.",
    related: ["Hierarchical Clustering", "Clustering"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Divisive Clustering",
    category: "AI/ML",
    definition: "Top-down hierarchical clustering recursively splitting. Divisive clustering is less common.",
    related: ["Hierarchical Clustering", "Clustering"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Silhouette Score",
    category: "AI/ML",
    definition: "A metric measuring cluster cohesion and separation. Silhouette score guides cluster number selection.",
    related: ["Clustering Evaluation", "Clustering"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Davies-Bouldin Index",
    category: "AI/ML",
    definition: "A metric comparing within-cluster and between-cluster distances. Davies-Bouldin evaluates clustering quality.",
    related: ["Clustering Evaluation", "Clustering"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Calinski-Harabasz Index",
    category: "AI/ML",
    definition: "A metric computing ratio of between-cluster to within-cluster variance. Calinski-Harabasz evaluates separation.",
    related: ["Clustering Evaluation", "Clustering"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Dunn Index",
    category: "AI/ML",
    definition: "A metric measuring minimum inter-cluster distance to maximum intra-cluster distance. Dunn index evaluates cluster quality.",
    related: ["Clustering Evaluation", "Clustering"],
    vendors: ["Scikit-learn"]
  },
  {
    term: "Adjusted Rand Index",
    abbr: "ARI",
    category: "AI/ML",
    definition: "A similarity measure between clusterings correcting for chance. ARI compares clustering solutions.",
    related: ["Clustering Evaluation", "Clustering"],
    vendors: ["Scikit-learn"]
  }
]);




