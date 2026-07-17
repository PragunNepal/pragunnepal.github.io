import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// =========================================================
// 1. BLACK HOLE VISUALIZATION COMPONENTS (HOME)
// =========================================================

function AccretionDisk({ count }) {
  const pointsRef = useRef();

  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorInside = new THREE.Color('#ffffff'); 
    const colorMiddle = new THREE.Color('#ffaa33'); 
    const colorOutside = new THREE.Color('#551100'); 

    for (let i = 0; i < count; i++) {
      const radius = 1.52 + Math.pow(Math.random(), 3) * 6.0;
      const theta = Math.random() * 2 * Math.PI;
      const thickness = Math.max(0.05, (radius - 1.52)) * 0.4;
      const y = (Math.random() - 0.5) * thickness;

      positions[i * 3] = radius * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = radius * Math.sin(theta);

      const normalizedDist = Math.min(1, (radius - 1.52) / (6.0 * 0.5));
      const mixedColor = new THREE.Color();
      
      if (normalizedDist < 0.3) {
        mixedColor.lerpColors(colorInside, colorMiddle, normalizedDist / 0.3);
      } else {
        mixedColor.lerpColors(colorMiddle, colorOutside, (normalizedDist - 0.3) / 0.7);
      }

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.12;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={data.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

function PhotonRing({ radius, count }) {
  const pointsRef = useRef();

  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const colorInside = new THREE.Color('#ffffff'); 
    const colorOutside = new THREE.Color('#ffcc88'); 

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const r = radius + (Math.random() - 0.5) * 0.15;
      
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      const z = (Math.random() - 0.5) * 0.1; 

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const mixedColor = new THREE.Color();
      mixedColor.lerpColors(colorInside, colorOutside, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    return { positions, colors };
  }, [radius, count]);

  useFrame((state, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.z += delta * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={data.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.012} vertexColors transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

function BlackHoleVisualization() {
  return (
    <group position={[0, 0, 0]} rotation={[0.20, -0.10, 0]}>
      <mesh>
        <sphereGeometry args={[1.52, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      <AccretionDisk count={50000} />
      <PhotonRing radius={1} count={1500} />
    </group>
  );
}

// =========================================================
// 2. ACCELERATING WARP STARFIELD COMPONENT (ABOUT ME)
// =========================================================

function StarBlock({ startZ }) {
  const ref = useRef();
  const count = 3000;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60; 
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60; 
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100; 
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.position.z += delta * 3; 
      
      if (ref.current.position.z > 100) {
        ref.current.position.z -= 200;
      }
    }
  });

  return (
    <points ref={ref} position={[0, 0, startZ]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#ffffff" transparent opacity={0.8} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Starfield() {
  return (
    <group>
      <StarBlock startZ={0} />
      <StarBlock startZ={-100} />
    </group>
  );
}

// =========================================================
// 3. SPACETIME GRID VISUALIZATION (RESEARCH)
// =========================================================

function SpacetimeGrid() {
  const ref = useRef();
  const count = 60;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * count * 3);
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count; j++) {
        const index = (i * count + j) * 3;
        pos[index] = (i - count / 2) * 0.5;      
        pos[index + 1] = -4;                     
        pos[index + 2] = (j - count / 2) * 0.5;  
      }
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ref.current) {
      const posArray = ref.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        for (let j = 0; j < count; j++) {
          const index = (i * count + j) * 3;
          const x = posArray[index];
          const z = posArray[index + 2];
          posArray[index + 1] = -4 + Math.sin(x * 0.4 + time * 0.5) * Math.cos(z * 0.4 + time * 0.5) * 1.5;
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref} rotation={[0.1, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count * count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#4da6ff" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// =========================================================
// 4. COSMIC FILAMENTS (PUBLICATIONS)
// =========================================================

function CosmicFilaments() {
  const ref = useRef();
  const count = 5000;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color1 = new THREE.Color('#4da6ff');
    const color2 = new THREE.Color('#ffb366');

    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 20;
      const radius = 5 + Math.random() * 15;
      
      const x = radius * Math.sin(t) + (Math.random() - 0.5) * 8;
      const y = radius * Math.cos(t * 0.8) + (Math.random() - 0.5) * 8;
      const z = radius * Math.sin(t * 1.2) + (Math.random() - 0.5) * 8;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      const mixedColor = new THREE.Color();
      mixedColor.lerpColors(color1, color2, Math.random());
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.04;
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// =========================================================
// 5. GOLDEN STELLAR CLUSTER (AWARDS)
// =========================================================

function GoldenStellarCluster() {
  const ref = useRef();
  const count = 4000;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorCenter = new THREE.Color('#ffcc00'); 
    const colorEdge = new THREE.Color('#ff6600');   

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 3) * 12; 
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const mixedColor = new THREE.Color();
      const normalizedR = Math.min(1, r / 8);
      mixedColor.lerpColors(colorCenter, colorEdge, normalizedR);
      
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      ref.current.rotation.z = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// =========================================================
// 6. NEBULA CLOUD VISUALIZATION (ACTIVITIES)
// =========================================================

function NebulaCloud() {
  const ref = useRef();
  const count = 10000;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color1 = new THREE.Color('#ff33cc'); 
    const color2 = new THREE.Color('#33ccff'); 

    for (let i = 0; i < count; i++) {
      const r = Math.cbrt(Math.random()) * 25;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2.0 * Math.random() - 1.0);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.5; 
      pos[i * 3 + 2] = r * Math.cos(phi);

      const mixedColor = new THREE.Color();
      const mixRatio = (Math.sin(theta) + 1) / 2; 
      mixedColor.lerpColors(color1, color2, mixRatio + (Math.random() * 0.2 - 0.1));
      
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.02;
      ref.current.rotation.z += delta * 0.005;
    }
  });

  return (
    <points ref={ref} rotation={[0.2, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// =========================================================
// 7. LARGE SCALE COSMIC WEB (CONTACT)
// =========================================================

function CosmicWeb() {
  const ref = useRef();
  const count = 15000; 

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const color1 = new THREE.Color('#4da6ff'); 
    const color2 = new THREE.Color('#9966ff'); 

    let added = 0;
    while (added < count) {
      const x = (Math.random() - 0.5) * 60;
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 60;

      const scale = 0.15;
      const val = Math.sin(x * scale) * Math.cos(y * scale) +
                  Math.sin(y * scale) * Math.cos(z * scale) +
                  Math.sin(z * scale) * Math.cos(x * scale);

      if (Math.abs(val) < 0.12) {
        pos[added * 3] = x;
        pos[added * 3 + 1] = y;
        pos[added * 3 + 2] = z;

        const mixedColor = new THREE.Color();
        mixedColor.lerpColors(color1, color2, Math.random());
        col[added * 3] = mixedColor.r;
        col[added * 3 + 1] = mixedColor.g;
        col[added * 3 + 2] = mixedColor.b;

        added++;
      }
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.015;
      ref.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} vertexColors transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
    </points>
  );
}


// =========================================================
// 8. DATA ARRAYS (PROJECTS, AWARDS, ACTIVITIES)
// =========================================================

const projectsData = [
  {
    title: "Epoch of Reionization 21-cm Signal",
    subtitle: "NIT Calicut | Summer Internship",
    description: "Simulating and Quantifying the Epoch of Reionization using the 21-cm signal. Conducted under the supervision of Dr. Rajesh Mondal.",
    links: [
      { label: "Project Report", url: "https://drive.google.com/file/d/1cvaGHRXrJ7Cg2dbtR9GU2XXnOpgqsHRD/view?usp=sharing" },
      { label: "Internship Certificate", url: "https://drive.google.com/file/d/1VCftTG50pBZr9z4TFvrP65OKMeV_yT_J/view?usp=sharing" },
      { label: "Simulations Playlist", url: "https://www.youtube.com/playlist?list=PL8qNa-buoe7zT8AoZjZHM_3SUkPMqjXJf" },
      { label: "GitHub: N-body Sim", url: "https://github.com/PragunNepal/N-body_Simulation" },
      { label: "GitHub: P-k-Sim N-body", url: "https://github.com/PragunNepal/P-k-Simulation_N-body" },
      { label: "GitHub: P-k-Sim EoR", url: "https://github.com/PragunNepal/P-k-Simulation_EoR" },
      { label: "GitHub: Halo Formation", url: "https://github.com/PragunNepal/Halo_Formation_Simulation" },
      { label: "GitHub: HI Map Sim", url: "https://github.com/PragunNepal/HI_Map_Simulation" },
      { label: "GitHub: N-body Halo Formation", url: "https://github.com/PragunNepal/N-body_Simulation.Halo_Formation" },
      { label: "GitHub: N-body with Halos", url: "https://github.com/PragunNepal/N-body_Simulation_with_Halos" }
    ]
  },
  {
    title: "2nd SKA India Summer Training School",
    subtitle: "SKA India Consortium | IIT Kanpur",
    description: "Selected for and Participated in SKAITS-2 : a two-week program focused on radio astronomy, astronomical instrumentation, scientific computing, and data analysis for the Square Kilometre Array (SKA) Observatory through expert lectures and hands-on training.",
    links: [
      { label: "Project Presentation", url: "https://drive.google.com/file/d/1CPCdgZyzs61RhcRCX5BRZZRQ_IwI_O0P/view?usp=sharing" },
      { label: "Certificate of Completion", url: "https://drive.google.com/file/d/15kiSZPt2JcVpaLct-RjblH1pok3hCkXy/view?usp=sharing" },
      { label: "Best Presentation Award", url: "https://drive.google.com/file/d/1HOteRIWbUoHFZcrKPve0GZ0ZVn_iza04/view?usp=sharing" },
      { label: "Group Photo", url: "https://drive.google.com/file/d/1t92FmQHfqIwp33J9XsWwrpveF1u-rHCP/view?usp=sharing"}
    ]
  },
  {
    title: "Bright Hα Emitters in Euclid Q1",
    subtitle: "Instituto de Astrofisica e Ciencias do Espaco",
    description: "IA Summer Program (Online) conducted by Instituto de Astrofisica e Ciencias do Espaco, Lisbon. Supervised by Dr. Ana S. Paulino Afonso.",
    links: [
      { label: "Project Presentation", url: "https://drive.google.com/file/d/1J-xbubOen4stB8m-jEv_i5jDRmas3S_S/view?usp=sharing" },
      { label: "Certificate of Completion", url: "https://drive.google.com/file/d/1sk6pN-jyKeUkBsuWt1nLJ4isosVHfYVp/view?usp=sharing" }
    ]
  },
  {
    title: "Intro Summer School in Astro & Astrophysics",
    subtitle: "IISER Mohali",
    description: "Online Introductory Summer School in Astronomy and Astrophysics conducted by IISER Mohali.",
    links: [
      { label: "Certificate of Completion", url: "https://drive.google.com/file/d/1MKyB_SNu6xkSxFaf1Vj1xM_yU8jMrS85/view?usp=sharing" }
    ]
  },
  {
    title: "Bayesian Analysis of InPTA DR-2",
    subtitle: "IISER TVM | Summer Internship",
    description: "Summer Internship conducted under the supervision of Dr. Abhimanyu Susobhanan at IISER Thiruvananthapuram.",
    links: []
  },
  {
    title: "Binary and Millisecond Pulsars",
    subtitle: "IISER TVM | Reading Project",
    description: "Reading project conducted under the supervision of Dr. Shabnam Iyyani at IISER Thiruvananthapuram.",
    links: []
  },
  {
    title: "Financial Dynamics in Sports",
    subtitle: "IISER TVM | PHY5132 Project",
    description: "Impact of Financial Dynamics on Performance and Competitive Balance of Athletes. Project done for the completion of the course PHY5132: Statistics and Data Analysis in Physical Sciences. Course Instructor: Dr. Shabnam Iyyani.",
    links: [
      { label: "Presentation Video", url: "https://youtu.be/8drRDBAGj5g" },
      { label: "GitHub Repository", url: "https://github.com/PragunNepal/Study-of-Finance-in-Sports" }
    ]
  },
  {
    title: "Lanelet2 Traffic Simulation",
    subtitle: "IISER TVM",
    description: "Simulation and Rule Formation in Lanelet2 for Indian Traffic. Conducted under Dr. Arvind Kumar Pal at IISER TVM.",
    links: [
      { label: "Installation Guide (Ubuntu, JOSM, Lanelet2)", url: "https://drive.google.com/file/d/1SuAOv5jW2eODqnxPFvzQm3TLSDvduFZh/view?usp=sharing" }
    ]
  },
  {
    title: "Distorted Yet Ordered",
    subtitle: "Anvesha 2024 | Study of NLD Systems",
    description: "Team Project done for Anvesha 2024 (Annual Science Expo of IISER Thiruvananthapuram). Models explored: double pendulum; Lorenz attractor; Lotka–Volterra competition; Rayleigh–Bénard convection; Belousov–Zhabotinsky-type reactions.",
    links: []
  }
];

const awardsData = [
  {
    year: "2025 - 2026",
    title: "Scientific Spark",
    organization: "Science and Technology Council, IISER TVM",
    description: "Awarded to students from the non-graduating batch for significant contributions towards science-related activities.",
    link: "https://drive.google.com/file/d/1q06tZPvaNkGfDCggghJ80H-kOzQsZPBa/view?usp=sharing"
  },
  {
    year: "Jan 2026",
    title: "Elected Club Secretary",
    organization: "PSIT – Physics Society of IISER Thiruvananthapuram",
    description: "Elected to lead and manage the activities, initiatives, and events of the Physics Society."
  },
  {
    year: "Sep 2025",
    title: "Elected Council Member",
    organization: "Science and Technology Council – IISER TVM",
    description: "Elected to represent the student body and coordinate science and technology initiatives at the institute."
  },
  {
    year: "Jan 2025 - Dec 2025",
    title: "Club Coordinator",
    organization: "PSIT – Physics Society of IISER Thiruvananthapuram",
    description: "Coordinated various physics-related events, reading groups, and discussions for the IISER TVM student community."
  },
  {
    year: "2024",
    title: "Kerala State Toppers - Mimamsa",
    organization: "Organised by IISER Pune",
    description: "Secured the position of Kerala State Toppers in Mimamsa, a national-level science competition.",
    link: "https://drive.google.com/file/d/14qmw27IeOtxARdoBV6NECGBkBe0MJpmg/view?usp=sharing"
  },
  {
    year: "Oct 2022",
    title: "Project Team Lead",
    organization: "Auxilio Egentium (Social Service), St. Joseph’s School, Darjeeling",
    description: "Led social service initiatives and community support projects."
  },
  {
    year: "2012–19, 2022",
    title: "Academic Award for Excellence",
    organization: "St. Joseph's School, Darjeeling",
    description: "Awarded for demonstrating consistent academic excellence across multiple academic years.",
    link: "https://drive.google.com/file/d/1FuCECPC9M_QgPGPyLWFAM2fxTdFnEUDO/view?usp=sharing"
  },
  {
    year: "Nov 2019",
    title: "Junior Diploma – Hindustani Classical Music (Vocal)",
    organization: "Bangia Sangeet Parishad",
    description: "Successfully completed and awarded the Junior Diploma in Hindustani Classical Music (Vocal).",
    link: "https://drive.google.com/file/d/12lyXQFG_1K5g32Gqck8LTMfpHLyLzEEK/view?usp=sharing"
  },
  {
    year: "Jun 2019",
    title: "Advanced Level 4 (Graduate) – Mental Mathematics",
    organization: "SIP Abacus",
    description: "Successfully graduated the Advanced Level 4 program in Mental Mathematics.",
    link: "https://drive.google.com/file/d/1ZceNC8jYnR_n-V5kzXeKvLuR3l_yq6jS/view?usp=sharing"
  },
  {
    year: "2016, 2019",
    title: "Rector’s Meritorious Award",
    organization: "St. Joseph's School, Darjeeling",
    description: "Awarded to the overall best student recognizing a balance of exceptional academics and co-curricular involvement.",
    link: "https://drive.google.com/file/d/1ekJAT79iNmqEbsFQwDSA-sdsFv7uiVnF/view?usp=sharing"
  },
  {
    year: "2017",
    title: "LIC Student of the Year Award",
    organization: "Life Insurance Corporation of India (LIC)",
    description: "Awarded for exhibiting consistent excellence in academics during the 2016–17 academic year."
  }
];

const activitiesData = [
  {
    date: "Mar 2026",
    role: "Semi-Finalist",
    organization: "Altus Disputatio - NUALS Kochi",
    description: "Participated in the Invitational Debate Competition organized by NUALS Kochi and reached the semi-finals.",
    link: "https://drive.google.com/file/d/1XCg3otizbVxOmfgiL8H6ZlHzZcRsChz4/view?usp=sharing"
  },
  {
    date: "2024 - 2025",
    role: "Participant & Finalist",
    organization: "Inter INCI Cultural Meet",
    description: "2024: Participated in Debate and Poetry Writing. 2025: Placed 4th in Debate, Poetry Writing, and JAM English, and participated in Quiz.",
    link: "https://drive.google.com/file/d/1ft107XxL--cd7StaKMnG6OUywkoyhxok/view?usp=sharing"
  },
  {
    date: "2024",
    role: "Volunteer (Design & Social Media)",
    organization: "iGEM IISER TVM (PeTAL)",
    description: "Contributed to the IISER TVM iGEM team (PeTAL) by managing design and social media initiatives.",
    link: "https://drive.google.com/file/d/17vFKp01qaMpdXlpKDWuD5S7Y3biNQl2p/view?usp=sharing"
  },
  {
    date: "Jan 2024",
    role: "Special Mention (Qatar)",
    organization: "IISc Pravega X MUN",
    description: "Represented Qatar in the UNGA DISEC committee and received a Special Mention.",
    link: "https://drive.google.com/file/d/1AyL7l69chSPmlyd--1KEgOWIE5GbZaeY/view?usp=sharing"
  },
  {
    date: "2013 - 2022",
    role: "Participant & Finalist",
    organization: "Inter-Class Quiz",
    description: "Consistently participated in the Inter-Class Quiz across multiple years (2013, 2017, 2018), reaching the finals in 2022.",
    link: "https://drive.google.com/file/d/1d8eSABmDWZ3BWrm4vjmbOkLyOcgo3rpE/view?usp=sharing"
  },
  {
    date: "2014, 2016, 2022",
    role: "1st Place & Participant",
    organization: "Science Exhibition",
    description: "Secured 1st place in 2014 and actively participated in the 2016 and 2022 editions.",
    link: "https://drive.google.com/file/d/1dJFE3Kgkq5Awe0pFQusXIPXd0k9VhXrR/view?usp=sharing"
  },
  {
    date: "2016, 2022",
    role: "Participant",
    organization: "Inter-School Vernacular Elocution - Nepali",
    description: "Represented the school in the Nepali Vernacular Elocution competitions.",
    link: "https://drive.google.com/file/d/1koAwRRiPn22Y542IXuxGPwHUiM6QWQcO/view?usp=sharing"
  },
  {
    date: "2022",
    role: "Finalist",
    organization: "Inspiria Q Quiz Competition",
    description: "Reached the final rounds of the Inspiria Q Quiz Competition 2022.",
    link: "https://drive.google.com/file/d/1LNHCi2Gr45K07kwM-I7m4bxXQOjCPPa0/view?usp=sharing"
  },
  {
    date: "2022",
    role: "Winner (Debate, Quiz)",
    organization: "Anglo Indian Schools ISC Fest",
    description: "Secured 1st place in both the Debate and Quiz events at the ISC Fest.",
    link: "https://drive.google.com/file/d/1TzTDDzzsk1ijiPuMR-pPEW8Z_zxB3WMY/view?usp=sharing"
  },
  {
    date: "2022",
    role: "Winner & Best Speaker",
    organization: "Inter-Class Debate Competition",
    description: "Secured overall 1st place and was awarded the Best Speaker accolade.",
    link: "https://drive.google.com/file/d/1T_hFIpXSQ6d6TLrAsUfXpIRVKAng9id8/view?usp=sharing"
  },
  {
    date: "2021",
    role: "Participant",
    organization: "Qriosity Quiz - Schoolini University",
    description: "Participated in the Inter-School Qualifying Round of Qriosity Quiz 2021.",
    link: "https://drive.google.com/file/d/1c3Q_0SOvy8Mi3xlYiDCN8VXejE9EIpSr/view?usp=sharing"
  },
  {
    date: "2019",
    role: "2nd Place",
    organization: "Inter-School PPT Competition",
    description: "Organized by Goethals Memorial School. Secured the runner-up position.",
    link: "https://drive.google.com/file/d/19sAEiydJ5Xm-YuHp0TuyxhC2ZjQDL4oT/view?usp=sharing"
  },
  {
    date: "2018",
    role: "Participant",
    organization: "Inter-Class Elocution Competition",
    description: "Actively participated in the school elocution event.",
    link: "https://drive.google.com/file/d/1Kry0cbl4__PFzZybrvUvAnd_Vsjiw8n2/view?usp=sharing"
  },
  {
    date: "2018",
    role: "Participant",
    organization: "3rd Movie Making Workshop",
    description: "Gained hands-on experience in film production and storytelling techniques.",
    link: "https://drive.google.com/file/d/1adWXjagMe-QGE9ocGsOT04BEZJYigGi1/view?usp=sharing"
  },
  {
    date: "2017",
    role: "Participant",
    organization: "Glass Painting Workshop",
    description: "Explored creative expression and techniques in glass painting.",
    link: "https://drive.google.com/file/d/1z_tHV_VgG-WrHlCD6d7DlHu9mbSwSVfw/view?usp=sharing"
  },
  {
    date: "2014 - 2016",
    role: "Participant",
    organization: "Autumn Colours SIT & Draw Competition",
    description: "Consistently participated over three consecutive years (2014, 2015, 2016).",
    link: "https://drive.google.com/file/d/1ifsrEiRRY3Ae4tSLxWpygwglNP96zvGo/view?usp=sharing"
  },
  {
    date: "2015",
    role: "Participant",
    organization: "Atlantis Aerospace & Science Discovery Camp",
    description: "Engaged in immersive science discovery and aerospace activities.",
    link: "https://drive.google.com/file/d/1LgGwGtpIYbN6r6RgfKIWOv52a7NeW4H2/view?usp=sharing"
  },
  {
    date: "2015",
    role: "Participant",
    organization: "Inter-class Spelling Bee",
    description: "Competed in the school-level spelling bee.",
    link: "https://drive.google.com/file/d/1vNB5L-2M4ou8lEyHQhesSu8JEkY8OxTA/view?usp=sharing"
  },
  {
    date: "2015",
    role: "Participant",
    organization: "North Point Academy Sit & Draw",
    description: "Participated in the annual Sit & Draw competition.",
    link: "https://drive.google.com/file/d/1g-5HL3XIZoZ8jP4j_LMkVmFUfSvjb-fA/view?usp=sharing"
  }
];

// =========================================================
// 9. UI COMPONENTS (GALLERIES, TIMELINES)
// =========================================================

function ProjectsGallery() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedProjects = isExpanded ? projectsData : projectsData.slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', paddingBottom: '2rem' }}>
      {displayedProjects.map((proj, index) => {
        const isHovered = hoveredIndex === index;
        return (
          <div
            key={index}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              padding: '1.5rem 2rem',
              border: isHovered ? '1px solid rgba(77, 166, 255, 0.4)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              background: isHovered ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.4s ease',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: '1.3rem', 
                fontFamily: "'Space Grotesk', sans-serif", 
                color: isHovered ? '#ffffff' : '#ffb366', 
                transition: 'color 0.3s' 
              }}>
                {proj.title}
              </h3>
              <span style={{ color: '#4da6ff', fontSize: '0.95rem', fontWeight: 600 }}>
                {proj.subtitle}
              </span>
            </div>

            <div style={{ 
              maxHeight: isHovered ? '500px' : '0px', 
              opacity: isHovered ? 1 : 0, 
              transition: 'all 0.5s ease',
              marginTop: isHovered ? '1rem' : '0'
            }}>
              <p style={{ fontSize: '1.05rem', margin: '0 0 1rem 0', lineHeight: '1.6', opacity: 0.9 }}>
                {proj.description}
              </p>
              
              {proj.links && proj.links.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '1rem' }}>
                  {proj.links.map((link, i) => (
                    <a 
                      key={i} 
                      href={link.url} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        padding: '0.4rem 0.8rem',
                        backgroundColor: 'rgba(77, 166, 255, 0.1)',
                        border: '1px solid rgba(77, 166, 255, 0.3)',
                        borderRadius: '20px',
                        color: '#4da6ff',
                        fontSize: '0.85rem',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = 'rgba(77, 166, 255, 0.2)';
                        e.target.style.borderColor = 'rgba(77, 166, 255, 0.6)';
                        e.target.style.color = '#ffffff';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = 'rgba(77, 166, 255, 0.1)';
                        e.target.style.borderColor = 'rgba(77, 166, 255, 0.3)';
                        e.target.style.color = '#4da6ff';
                      }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {projectsData.length > 4 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              padding: '0.8rem 2rem',
              backgroundColor: 'rgba(77, 166, 255, 0.1)',
              border: '1px solid rgba(77, 166, 255, 0.3)',
              borderRadius: '30px',
              color: '#4da6ff',
              fontSize: '0.95rem',
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backdropFilter: 'blur(5px)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(77, 166, 255, 0.2)';
              e.target.style.borderColor = 'rgba(77, 166, 255, 0.6)';
              e.target.style.color = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(77, 166, 255, 0.1)';
              e.target.style.borderColor = 'rgba(77, 166, 255, 0.3)';
              e.target.style.color = '#4da6ff';
            }}
          >
            {isExpanded ? 'Show Less ↑' : `View All ${projectsData.length} Projects ↓`}
          </button>
        </div>
      )}
    </div>
  );
}

function AwardsGallery() {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedAwards = isExpanded ? awardsData : awardsData.slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', paddingBottom: '2rem' }}>
      {displayedAwards.map((award, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          padding: '2rem',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 204, 0, 0.2)',
          transition: 'transform 0.3s ease, border-color 0.3s ease',
          cursor: 'default'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateX(10px)';
          e.currentTarget.style.borderColor = 'rgba(255, 204, 0, 0.6)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.borderColor = 'rgba(255, 204, 0, 0.2)';
        }}>
          <div style={{ flex: '0 0 160px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.4rem', margin: 0, color: '#ffcc00', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>{award.year}</h3>
          </div>
          <div style={{ flex: '1' }}>
            <h4 style={{ fontSize: '1.4rem', margin: '0 0 0.5rem 0', fontFamily: "'Space Grotesk', sans-serif", color: '#ffffff' }}>{award.title}</h4>
            <p style={{ fontSize: '0.95rem', color: '#ffb366', margin: '0 0 0.8rem 0', fontWeight: 600 }}>{award.organization}</p>
            <p style={{ fontSize: '1rem', opacity: 0.8, margin: 0, lineHeight: '1.6' }}>{award.description}</p>
            
            {award.link && (
              <div style={{ marginTop: '1rem' }}>
                <a href={award.link} target="_blank" rel="noreferrer" style={{
                  display: 'inline-block',
                  padding: '0.4rem 1rem',
                  backgroundColor: 'rgba(255, 204, 0, 0.1)',
                  border: '1px solid rgba(255, 204, 0, 0.4)',
                  borderRadius: '20px',
                  color: '#ffcc00',
                  fontSize: '0.85rem',
                  fontFamily: "'Inter', sans-serif",
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 204, 0, 0.3)';
                  e.target.style.color = '#ffffff';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 204, 0, 0.1)';
                  e.target.style.color = '#ffcc00';
                }}>
                  View Certificate
                </a>
              </div>
            )}
          </div>
        </div>
      ))}

      {awardsData.length > 4 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              padding: '0.8rem 2rem',
              backgroundColor: 'rgba(255, 204, 0, 0.1)',
              border: '1px solid rgba(255, 204, 0, 0.3)',
              borderRadius: '30px',
              color: '#ffcc00',
              fontSize: '0.95rem',
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backdropFilter: 'blur(5px)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 204, 0, 0.2)';
              e.target.style.borderColor = 'rgba(255, 204, 0, 0.6)';
              e.target.style.color = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 204, 0, 0.1)';
              e.target.style.borderColor = 'rgba(255, 204, 0, 0.3)';
              e.target.style.color = '#ffcc00';
            }}
          >
            {isExpanded ? 'Show Less ↑' : `View All ${awardsData.length} Awards & Recognitions ↓`}
          </button>
        </div>
      )}
    </div>
  );
}

function ActivitiesTimeline() {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayedActivities = isExpanded ? activitiesData : activitiesData.slice(0, 4);

  return (
    <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingLeft: '2rem', paddingBottom: '2rem' }}>
      {/* Vertical Connecting Line */}
      <div style={{ position: 'absolute', left: '2rem', top: '1rem', bottom: '1rem', width: '2px', background: 'linear-gradient(to bottom, rgba(51, 204, 255, 0.8), rgba(255, 51, 204, 0.2))', zIndex: 0 }}></div>

      {displayedActivities.map((activity, index) => (
        <div key={index} style={{ position: 'relative', display: 'flex', flexDirection: 'column', paddingLeft: '3rem', zIndex: 1 }}>
          {/* Glowing Timeline Node */}
          <div style={{ position: 'absolute', left: '-5px', top: '5px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#33ccff', boxShadow: '0 0 10px #33ccff, 0 0 20px #ff33cc' }}></div>
          
          <div style={{ 
            background: 'rgba(0,0,0,0.6)', 
            backdropFilter: 'blur(10px)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '16px', 
            padding: '2rem',
            transition: 'all 0.3s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'rgba(51, 204, 255, 0.5)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <span style={{ display: 'inline-block', padding: '0.3rem 0.8rem', background: 'rgba(255, 51, 204, 0.1)', border: '1px solid rgba(255, 51, 204, 0.3)', borderRadius: '20px', color: '#ff33cc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem', fontFamily: "'Space Grotesk', sans-serif" }}>
              {activity.date}
            </span>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontFamily: "'Space Grotesk', sans-serif", color: '#ffffff' }}>
              {activity.role}
            </h3>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#33ccff', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
              {activity.organization}
            </h4>
            <p style={{ margin: 0, fontSize: '1rem', lineHeight: '1.7', opacity: 0.85, fontFamily: "'Inter', sans-serif" }}>
              {activity.description}
            </p>

            {activity.link && (
              <a href={activity.link} target="_blank" rel="noreferrer" style={{
                display: 'inline-block', marginTop: '1.5rem', padding: '0.5rem 1.2rem', backgroundColor: 'rgba(51, 204, 255, 0.1)', border: '1px solid rgba(51, 204, 255, 0.3)', borderRadius: '30px', color: '#33ccff', fontSize: '0.9rem', fontFamily: "'Inter', sans-serif", textDecoration: 'none', transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(51, 204, 255, 0.2)';
                e.target.style.color = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(51, 204, 255, 0.1)';
                e.target.style.color = '#33ccff';
              }}>
                View Details
              </a>
            )}
          </div>
        </div>
      ))}

      {activitiesData.length > 4 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem', position: 'relative', zIndex: 2 }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              padding: '0.8rem 2rem',
              backgroundColor: 'rgba(51, 204, 255, 0.1)',
              border: '1px solid rgba(51, 204, 255, 0.3)',
              borderRadius: '30px',
              color: '#33ccff',
              fontSize: '0.95rem',
              fontFamily: "'Inter', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backdropFilter: 'blur(5px)'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = 'rgba(51, 204, 255, 0.2)';
              e.target.style.borderColor = 'rgba(51, 204, 255, 0.6)';
              e.target.style.color = '#ffffff';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'rgba(51, 204, 255, 0.1)';
              e.target.style.borderColor = 'rgba(51, 204, 255, 0.3)';
              e.target.style.color = '#33ccff';
            }}
          >
            {isExpanded ? 'Show Less ↑' : `View All ${activitiesData.length} Activities ↓`}
          </button>
        </div>
      )}
    </div>
  );
}


// =========================================================
// 10. UI NAV & LAYOUT
// =========================================================

function Navbar() {
  return (
    <nav style={{
      position: 'absolute', top: 0, left: 0, width: '100%', padding: '2rem 5%',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      zIndex: 10, pointerEvents: 'auto', fontFamily: "'Inter', sans-serif",
      boxSizing: 'border-box'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', letterSpacing: '-0.05em' }}>
        pragun.
      </div>
      <div style={{ display: 'flex', gap: '2.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', flexWrap: 'wrap' }}>
        <a href="#about" style={{ color: '#f3f4f6', textDecoration: 'none', opacity: 0.8, cursor: 'pointer' }}>About</a>
        <a href="#research" style={{ color: '#f3f4f6', textDecoration: 'none', opacity: 0.8, cursor: 'pointer' }}>Research</a>
        <a href="#publications" style={{ color: '#f3f4f6', textDecoration: 'none', opacity: 0.8, cursor: 'pointer' }}>Publications</a>
        <a href="#awards" style={{ color: '#f3f4f6', textDecoration: 'none', opacity: 0.8, cursor: 'pointer' }}>Awards</a>
        <a href="#activities" style={{ color: '#f3f4f6', textDecoration: 'none', opacity: 0.8, cursor: 'pointer' }}>Activities</a>
        <a href="https://drive.google.com/file/d/140852q9KffL8ctz8mOjZX6cHO1XFN0PC/view?usp=sharing" target="_blank" rel="noreferrer" style={{ color: '#f3f4f6', textDecoration: 'none', opacity: 0.8, cursor: 'pointer' }}>CV</a>
        <a href="#contact" style={{ color: '#f3f4f6', textDecoration: 'none', opacity: 0.8, cursor: 'pointer' }}>Contact</a>
      </div>
    </nav>
  );
}

function ScrollIndicator() {
  return (
    <div style={{
      position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
      zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center',
      pointerEvents: 'auto', cursor: 'pointer'
    }} onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}>
      <span style={{ color: '#ffb366', fontSize: '0.75rem', letterSpacing: '0.15em', marginBottom: '1rem', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', opacity: 0.8 }}>
        Explore
      </span>
      <div style={{ width: '2px', height: '40px', backgroundColor: 'rgba(255, 255, 255, 0.1)', position: 'relative', overflow: 'hidden' }}>
         <div style={{ width: '100%', height: '50%', backgroundColor: '#fff', animation: 'slideDown 2s infinite' }}></div>
      </div>
    </div>
  );
}

// Clean SVG Icons
const MailIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>);
const LinkedInIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>);
const GitHubIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>);
const PhoneIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>);
const WhatsAppIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>);
const InstagramIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>);
const FacebookIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>);
const YouTubeIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2C5.12 19.5 12 19.5 12 19.5s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>);


function App() {
  return (
    <div style={{ width: '100vw', minHeight: '100vh', backgroundColor: '#030303', color: '#f3f4f6', overflowX: 'hidden', scrollBehavior: 'smooth' }}>
      
      {/* --- Global Styles --- */}
      <style>
        {`
          @keyframes slideDown {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(8px); }
            60% { transform: translateY(4px); }
          }
        `}
      </style>

      {/* ----------------- 1. HERO SECTION (Black Hole) ----------------- */}
      <div id="home" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        
        <Navbar />

        <div style={{ position: 'absolute', top: 0, left: '25%', width: '100%', height: '100%', zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={0.1} />
            <BlackHoleVisualization />
          </Canvas>
        </div>

        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: '5%', pointerEvents: 'none', boxSizing: 'border-box' }}>
          <div style={{ maxWidth: '800px', pointerEvents: 'auto' }}>
            <h1 style={{ fontSize: '4.5rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '-0.06em', fontFamily: "'Space Grotesk', sans-serif", color: '#f3f4f6' }}>
              Hello, I'm Pragun Nepal
            </h1>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '400', color: '#ffb366', marginBottom: '2.5rem', fontFamily: "'Space Grotesk', sans-serif" }}>
              Aspiring Cosmologist & Astrophysicist | Student @ IISER TVM
            </h2>
            
            <div style={{ maxWidth: '800px', lineHeight: '1.7', opacity: 0.9, fontFamily: "'Inter', sans-serif", color: '#f3f4f6' }}>
              <p>
                I'm a physics student driven by curiosity about how the universe works, from the behavior of compact objects to the fundamental processes that shape cosmic evolution. Alongside my academic pursuits, I enjoy working on computational projects, science communication, and initiatives that bring people together through a shared passion for science. I aspire to build a career in astrophysics research, combining theoretical understanding, computational methods, and effective scientific communication.
              </p>
            </div>
          </div>
        </div>

        <ScrollIndicator />
      </div>

      {/* ----------------- 2. ABOUT ME SECTION ------------------ */}
      <div id="about" style={{ position: 'relative', width: '100%', minHeight: '100vh', borderTop: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5%', boxSizing: 'border-box' }}>
        
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Starfield />
          </Canvas>
        </div>

        <div style={{ zIndex: 1, display: 'flex', gap: '5rem', maxWidth: '1100px', width: '100%', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', pointerEvents: 'auto' }}>
          
          <div style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: 0 }}>
            <div style={{ width: '100%', aspectRatio: '1/1', backgroundColor: 'rgba(20,20,20,0.8)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', position: 'relative' }}>
              <span style={{ position: 'absolute', zIndex: 1, opacity: 0.5, fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', textAlign: 'center', padding: '2rem' }}>
                Ensure <strong>pragun.jpg</strong> is placed inside your project's <strong>public/</strong> folder.
              </span>
              <img 
                src="/pragun.jpg" 
                alt="Pragun Nepal" 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 2, backgroundColor: '#ffffff' }} 
                onError={(e) => {
                  e.target.style.display = 'none'; 
                  e.target.nextSibling.style.display = 'block'; 
                }}
              />
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)', textAlign: 'center' }}>
              <h3 style={{ color: '#ffb366', fontSize: '1.4rem', margin: '0 0 1rem 0', fontFamily: "'Space Grotesk', sans-serif" }}>Pragun Nepal</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', opacity: 0.9, fontSize: '1rem', fontFamily: "'Inter', sans-serif", alignItems: 'center' }}>
                <p style={{ margin: 0 }}>Hometown : Darjeeling, West Bengal - 734003</p>
                <p style={{ margin: 0 }}>Currently pursuing</p>
                <p style={{ margin: 0 }}>BS-MS (Physics with Mathematics minor) at Indian Institute of Science Education and Research (IISER) Thiruvananthapuram</p>
                <p style={{ margin: 0 }}>Completed schooling at St. Joseph's School, North Point, Darjeeling</p>
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 500px', marginTop: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 style={{ margin: '0 0 2rem 0', fontSize: '4rem', fontWeight: 'bold', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.04em' }}>
              About Me
            </h2>
            
            <div style={{ opacity: 0.9, fontSize: '1.3rem', lineHeight: '1.8', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p style={{ margin: 0 }}>
                I am an undergraduate student pursuing an Integrated BS-MS degree in Physics at the Indian Institute of Science Education and Research (IISER), Thiruvananthapuram. My primary research interests lie in cosmology, astrophysics, and radio astronomy, with a particular focus on the large-scale structure of the Universe and 21-cm cosmology.
              </p>
              <p style={{ margin: 0 }}>
                My fascination with the cosmos began during my school years and has since evolved into a passion for understanding the fundamental laws that govern our Universe. Throughout my academic journey, I have actively sought opportunities to engage in research, including projects and workshops in cosmology and radio astronomy, which have strengthened my interest in pursuing a career in scientific research.
              </p>
              <p style={{ margin: 0 }}>
                I am particularly interested in the intersection of theoretical physics, computational methods, and data-driven approaches to astronomy. I enjoy developing mathematical and computational tools to study complex physical phenomena and to extract meaningful insights from large datasets.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ----------------- 3. RESEARCH SECTION ------------------ */}
      <div id="research" style={{ position: 'relative', width: '100%', minHeight: '100vh', borderTop: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5%', boxSizing: 'border-box' }}>
        
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
            <ambientLight intensity={0.1} />
            <SpacetimeGrid />
          </Canvas>
        </div>

        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', width: '100%', pointerEvents: 'auto' }}>
          
          <div style={{ width: '100%', textAlign: 'center', marginBottom: '0.5rem' }}>
            <h2 style={{ fontSize: '4rem', fontWeight: 'bold', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '1rem', letterSpacing: '-0.04em' }}>
              Research & Projects
            </h2>
            <p style={{ opacity: 0.85, fontSize: '1.2rem', lineHeight: '1.8', fontFamily: "'Inter', sans-serif", maxWidth: '900px', margin: '0 auto' }}>
              Driven by curiosity and a passion for discovery, I enjoy working on projects that blend physics, mathematics, and computation. This section showcases my research experiences and academic projects, highlighting the ideas, challenges, and explorations that have shaped my journey in science.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '2rem', width: '100%', flexWrap: 'wrap' }}>
            
            <div style={{ flex: '1 1 calc(50% - 1rem)', minWidth: '300px' }}>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', background: '#000' }}>
                <iframe 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  src="https://www.youtube.com/embed/izSeQfEX1Ks?autoplay=1&mute=1&loop=1&playlist=izSeQfEX1Ks&controls=1&rel=0&modestbranding=1" 
                  title="Pragun Nepal YouTube Video 1" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            <div style={{ flex: '1 1 calc(50% - 1rem)', minWidth: '300px' }}>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', background: '#000' }}>
                <iframe 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  src="https://www.youtube.com/embed/MIQALlSH-dk?autoplay=1&mute=1&loop=1&playlist=MIQALlSH-dk&controls=1&rel=0&modestbranding=1" 
                  title="Pragun Nepal YouTube Video 2" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>

          </div>

          <div style={{ width: '100%', marginTop: '1rem' }}>
            <ProjectsGallery />
          </div>

        </div>
      </div>

      {/* ----------------- 4. PUBLICATIONS SECTION ------------------ */}
      <div id="publications" style={{ position: 'relative', width: '100%', minHeight: '100vh', borderTop: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5%', boxSizing: 'border-box' }}>
        
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
            <ambientLight intensity={0.1} />
            <CosmicFilaments />
          </Canvas>
        </div>

        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '800px', width: '100%', pointerEvents: 'auto', padding: '3rem', background: 'rgba(0,0,0,0.6)', borderRadius: '24px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '4rem', fontWeight: 'bold', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '1rem', letterSpacing: '-0.04em' }}>
            Publications
          </h2>
          <p style={{ opacity: 0.9, fontSize: '1.5rem', fontFamily: "'Inter', sans-serif", color: '#ffb366', fontWeight: 600 }}>
            Nothing yet, but coming soon!
          </p>
          <p style={{ opacity: 0.8, fontSize: '1.1rem', fontFamily: "'Inter', sans-serif", marginTop: '1rem', lineHeight: '1.6' }}>
            I am currently engaged in research projects and courses. I look forward to contributing to the scientific literature in the near future.
          </p>
        </div>
      </div>

      {/* ----------------- 5. AWARDS SECTION ------------------ */}
      <div id="awards" style={{ position: 'relative', width: '100%', minHeight: '100vh', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5%', boxSizing: 'border-box' }}>
        
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <ambientLight intensity={0.1} />
            <GoldenStellarCluster />
          </Canvas>
        </div>

        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1000px', width: '100%', pointerEvents: 'auto', marginTop: '4rem' }}>
          
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '4rem', fontWeight: 'bold', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '1rem', letterSpacing: '-0.04em' }}>
              Awards & Leadership
            </h2>
            <p style={{ opacity: 0.85, fontSize: '1.2rem', lineHeight: '1.8', fontFamily: "'Inter', sans-serif", maxWidth: '700px', margin: '0 auto' }}>
              A collection of academic milestones, recognitions, and positions of responsibility that have supported my journey and helped me develop.
            </p>
          </div>

          <AwardsGallery />

        </div>

      </div>

      {/* ----------------- 6. ACTIVITIES SECTION ------------------ */}
      <div id="activities" style={{ position: 'relative', width: '100%', minHeight: '100vh', borderTop: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5%', boxSizing: 'border-box' }}>
        
        {/* Nebula Cloud Background */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
            <ambientLight intensity={0.1} />
            <NebulaCloud />
          </Canvas>
        </div>

        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1000px', width: '100%', pointerEvents: 'auto', marginTop: '4rem' }}>
          
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '4rem', fontWeight: 'bold', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '1rem', letterSpacing: '-0.04em', color: '#ffffff' }}>
              Extracurricular Activities
            </h2>
            <p style={{ opacity: 0.85, fontSize: '1.2rem', lineHeight: '1.8', fontFamily: "'Inter', sans-serif", maxWidth: '800px', margin: '0 auto', color: '#f3f4f6' }}>
              A glimpse into the experiences that shape me beyond the classroom.
            </p>
          </div>

          {/* Render Timeline */}
          <ActivitiesTimeline />

        </div>
      </div>

      {/* ----------------- 7. CONTACT SECTION (Cosmic Web Background) ------------------ */}
      <div id="contact" style={{ position: 'relative', width: '100%', minHeight: '100vh', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5%', boxSizing: 'border-box', overflow: 'hidden' }}>
        
        {/* Deep Cosmic Web Background */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
            <ambientLight intensity={0.1} />
            <CosmicWeb />
          </Canvas>
        </div>

        {/* Contact Info Panel */}
        <div style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px', width: '100%', pointerEvents: 'auto', background: 'rgba(0,0,0,0.5)', padding: '4rem 3rem', borderRadius: '24px', backdropFilter: 'blur(12px)', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 'bold', fontFamily: "'Space Grotesk', sans-serif", marginBottom: '1rem', letterSpacing: '-0.04em', textAlign: 'center', color: '#ffffff' }}>
            Let's Connect
          </h2>
          <p style={{ opacity: 0.85, fontSize: '1.1rem', fontFamily: "'Inter', sans-serif", textAlign: 'center', marginBottom: '3rem', color: '#f3f4f6', lineHeight: '1.6' }}>
            Whether you want to discuss astrophysics, collaborate on a project, or just say hi, you can find me on any of these platforms!
          </p>
          
          {/* Vertical Single Column Layout for Contact Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', width: '100%', maxWidth: '450px' }}>
            
            {/* Email */}
            <a href="mailto:pragunnepal@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.2rem 1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(77, 166, 255, 0.6)'; e.currentTarget.style.background = 'rgba(77, 166, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ color: '#4da6ff' }}><MailIcon /></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: '#ffb366', fontFamily: "'Space Grotesk', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Email</span>
                <span style={{ fontSize: '1.05rem', fontFamily: "'Inter', sans-serif" }}>pragunnepal@gmail.com</span>
                <span style={{ fontSize: '1.05rem', fontFamily: "'Inter', sans-serif" }}>pragun23@iisertvm.ac.in</span>
              </div>
            </a>

            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/pragunnepal/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.2rem 1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(77, 166, 255, 0.6)'; e.currentTarget.style.background = 'rgba(77, 166, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ color: '#4da6ff' }}><LinkedInIcon /></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: '#ffb366', fontFamily: "'Space Grotesk', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>LinkedIn</span>
                <span style={{ fontSize: '1.05rem', fontFamily: "'Inter', sans-serif" }}>Pragun Nepal</span>
              </div>
            </a>

            {/* GitHub */}
            <a href="https://github.com/PragunNepal" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.2rem 1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(77, 166, 255, 0.6)'; e.currentTarget.style.background = 'rgba(77, 166, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ color: '#4da6ff' }}><GitHubIcon /></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: '#ffb366', fontFamily: "'Space Grotesk', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>GitHub</span>
                <span style={{ fontSize: '1.05rem', fontFamily: "'Inter', sans-serif" }}>PragunNepal</span>
              </div>
            </a>

            {/* Phone */}
            <a href="tel:+918101029180" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.2rem 1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(77, 166, 255, 0.6)'; e.currentTarget.style.background = 'rgba(77, 166, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ color: '#4da6ff' }}><PhoneIcon /></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: '#ffb366', fontFamily: "'Space Grotesk', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Phone</span>
                <span style={{ fontSize: '1.05rem', fontFamily: "'Inter', sans-serif" }}>+91 8101029180</span>
                <span style={{ fontSize: '1.05rem', fontFamily: "'Inter', sans-serif" }}>+91 6238596461</span>
              </div>
            </a>

            {/* YouTube */}
            <a href="https://www.youtube.com/@PragunNepal" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.2rem 1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', textDecoration: 'none', transition: 'all 0.3s ease' }} onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(77, 166, 255, 0.6)'; e.currentTarget.style.background = 'rgba(77, 166, 255, 0.08)'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ color: '#4da6ff' }}><YouTubeIcon /></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: '#ffb366', fontFamily: "'Space Grotesk', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>YouTube</span>
                <span style={{ fontSize: '1.05rem', fontFamily: "'Inter', sans-serif" }}>Pragun Nepal</span>
              </div>
            </a>

          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
