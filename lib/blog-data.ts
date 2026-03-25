export interface RecommendedGearItem {
  name: string;
  reason: string;
}

export interface BlogSection {
  id: string;
  title: string;
  content: string[];
  code?: {
    language: string;
    title: string;
    snippet: string;
  };
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readMinutes: number;
  heroImage: string;
  thumbnail: string;
  sections: BlogSection[];
  recommendedGear?: RecommendedGearItem[];
  publishedAt?: string;
  readingTime?: number;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "rtx-4090-llm-workstation-guide",
    title: "Building an RTX 4090 LLM Workstation for 70B-Class Inference",
    excerpt:
      "A practical architecture guide for balancing VRAM, quantization strategy, and sustained power delivery in a local AI workstation.",
    category: "Workstation Engineering",
    date: "2026-03-22",
    readMinutes: 14,
    heroImage:
      "https://images.unsplash.com/photo-1587202372634-32705e3e5d6d?auto=format&fit=crop&w=1800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1617135339900-d9eec5f6528e?auto=format&fit=crop&w=1200&q=80",
    sections: [
      {
        id: "target-workload",
        title: "Target Workload",
        content: [
          "For 70B-class local models, consistency matters more than synthetic peak throughput. The goal is stable token generation under sustained load.",
          "With 24GB VRAM, the RTX 4090 performs best with quantized model variants and tuned context windows. The rest of the system should reduce data stalls and thermal throttling.",
        ],
      },
      {
        id: "memory-and-quantization",
        title: "Memory and Quantization Strategy",
        content: [
          "A practical setup uses 4-bit or mixed-precision quantization depending on latency targets. NVMe swap behavior must be predictable to avoid tail-latency spikes.",
          "Pin model caches to fast local storage and avoid network mounts for frequently accessed tensors.",
        ],
        code: {
          language: "bash",
          title: "Quantized model launch command",
          snippet:
            "ollama run llama3:70b-instruct-q4_K_M \\\n  --ctx-size 8192 \\\n  --num-batch 512 \\\n  --num-gpu 1",
        },
      },
      {
        id: "power-thermals",
        title: "Power and Thermals",
        content: [
          "Under long inference sessions, transient spikes can destabilize weak PSU configurations. A quality 1000W+ PSU with clean rails and strong transient handling is recommended.",
          "Keep GPU hotspot temperatures controlled with front-to-back airflow and conservative fan curves to preserve sustained clock behavior.",
        ],
      },
      {
        id: "validation-checklist",
        title: "Validation Checklist",
        content: [
          "Run at least a 30-minute prompt stress test with mixed context lengths. Record token throughput, GPU power draw, and thermal saturation.",
          "If latency variance climbs over time, prioritize storage and thermal tuning before upgrading silicon.",
        ],
      },
    ],
    recommendedGear: [
      {
        name: "NVIDIA GeForce RTX 4090",
        reason: "24GB VRAM baseline for large local model inference.",
      },
      {
        name: "Corsair HX1200i PSU",
        reason: "Stable transient handling for sustained high-power inference workloads.",
      },
      {
        name: "Samsung 990 PRO 4TB",
        reason: "Fast model load and cache performance for repeated experiments.",
      },
    ],
  },
  {
    slug: "vram-budgeting-for-multimodal-models",
    title: "VRAM Budgeting for Multimodal AI Pipelines",
    excerpt:
      "How to estimate memory requirements for text+vision pipelines and prevent throughput collapse under parallel inference.",
    category: "Performance Tuning",
    date: "2026-03-19",
    readMinutes: 10,
    heroImage:
      "https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&w=1800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=1200&q=80",
    sections: [
      {
        id: "memory-model",
        title: "Memory Model",
        content: [
          "Multimodal pipelines combine embedding, vision preprocessing, and generation stages. Budget VRAM per stage and include activation overhead.",
          "Avoid sizing only for model weights; intermediate buffers and scheduler queues can dominate peak usage under concurrency.",
        ],
      },
    ],
    recommendedGear: [
      {
        name: "NVIDIA GeForce RTX 5090",
        reason: "Higher VRAM headroom for mixed multimodal workloads.",
      },
      {
        name: "G.Skill Trident Z5 96GB",
        reason: "Larger host memory for preprocessing and batching.",
      },
    ],
  },
  {
    slug: "dataflow-design-for-local-rag",
    title: "Dataflow Design for Low-Latency Local RAG Systems",
    excerpt:
      "A systems-level approach to chunking, index placement, and retrieval orchestration for local-first RAG stacks.",
    category: "Architecture",
    date: "2026-03-15",
    readMinutes: 12,
    heroImage:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=1200&q=80",
    sections: [
      {
        id: "retrieval-path",
        title: "Retrieval Path",
        content: [
          "Design retrieval as a deterministic path: ingest, normalize, chunk, embed, index, rerank. Treat each stage as a measurable service boundary.",
          "Keep embeddings and index shards on local NVMe when optimizing for predictable tail latency.",
        ],
      },
    ],
    recommendedGear: [
      {
        name: "Samsung 990 PRO 4TB",
        reason: "High random-read performance for local vector index access.",
      },
      {
        name: "AMD Ryzen 9 9950X",
        reason: "Strong host-side throughput for ingestion and embedding pipelines.",
      },
    ],
  },
  {
    slug: "quiet-cooling-for-24-7-ai-inference",
    title: "Quiet Cooling Design for 24/7 AI Inference",
    excerpt:
      "Thermal design patterns that keep workstation acoustics low while preserving deterministic inference performance.",
    category: "Thermal Design",
    date: "2026-03-09",
    readMinutes: 8,
    heroImage:
      "https://images.unsplash.com/photo-1630705604495-0742b7b644dc?auto=format&fit=crop&w=1800&q=80",
    thumbnail:
      "https://images.unsplash.com/photo-1628557044797-f21a177c37ec?auto=format&fit=crop&w=1200&q=80",
    sections: [
      {
        id: "airflow-zones",
        title: "Airflow Zones",
        content: [
          "Separate intake priorities for GPU and VRM zones. Avoid decorative fan layouts that look good but starve the hottest components.",
          "Balance positive pressure with targeted exhaust to keep dust under control over long operations.",
        ],
      },
    ],
    recommendedGear: [
      {
        name: "Noctua NH-D15 G2",
        reason: "Reliable thermal headroom with low acoustic profile.",
      },
      {
        name: "Arctic Liquid Freezer II 420",
        reason: "High sustained dissipation for heavy mixed workloads.",
      },
    ],
  },
];

export const featuredPost = blogPosts[0];

export function getBlogPosts() {
  return blogPosts;
}

export function getBlogPost(slug: string) {
  return blogPosts.find(post => post.slug === slug);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
