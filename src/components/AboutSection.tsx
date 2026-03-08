const AboutSection = () => {
  return (
    <section className="py-32 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <span className="font-mono text-xs tracking-[0.3em] uppercase text-muted-foreground block mb-4">
            // ABOUT
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Designer across<br />dimensions
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            I work at the intersection of interaction design, 3D visualization, and game development — 
            creating experiences that blur the line between functional interfaces and immersive worlds.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Each discipline informs the others: game mechanics sharpen my UX thinking, 
            3D skills add depth to interfaces, and interaction design brings polish to game experiences.
          </p>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-6 compartment-ixd glow-ixd">
            <h4 className="font-mono text-xs tracking-wider text-ixd mb-3">TOOLS — IXD</h4>
            <p className="text-sm text-muted-foreground">Figma, Framer, Principle, Adobe XD, ProtoPie</p>
          </div>
          <div className="glass-panel p-6 compartment-3d glow-3d">
            <h4 className="font-mono text-xs tracking-wider text-three-d mb-3">TOOLS — 3D</h4>
            <p className="text-sm text-muted-foreground">Blender, ZBrush, Substance Painter, Cinema 4D, Maya</p>
          </div>
          <div className="glass-panel p-6 compartment-game glow-game">
            <h4 className="font-mono text-xs tracking-wider text-game mb-3">TOOLS — GAME</h4>
            <p className="text-sm text-muted-foreground">Unreal Engine, Unity, Godot, Game Maker</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
