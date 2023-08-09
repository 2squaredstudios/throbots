while (true) {
    script.left();
    await script.wait(1000);
    if (Math.random() < 0.5) {
        script.crouch();
    }
    else {
        if (script.pickup()) {
            await script.wait(1000);
            script.throw(-100, -50);
        }
    }
    await script.wait(1000);
    script.right();
    await script.wait(1000);
    if (Math.random() < 0.5) {
        script.crouch();
    }
    else {
        if (script.pickup()) {
            await script.wait(1000);
            script.throw(100, -50);
        }
    }
    await script.wait(1000);
}