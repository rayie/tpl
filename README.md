
A tiny jquery plugin for rendering nested html inside javascript.

var t = new tpl();

```
t.w("#topLevelElement");
	t.w("subLevel");
		t.sib("someClass","the text inside div.someClass");
		t.sib("someOtherClass", someVar);
	t.ww(); //completes div.subLevel	
t.ww("#container") // 
```




